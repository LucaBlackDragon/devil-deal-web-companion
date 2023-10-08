import {
  ReactHTMLElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ClearGameButton from "./ClearGameButton";
import { PlayersContext, ScannerContext } from "../context";
import { PLAYER_COLOR, Player } from "../models";

type Proposal = {
  from: Player;
  to: Player;
};

type ChestTransactions = {
  from?: Player;
  to: Player;
};

enum PHASE {
  MAKE_FIRST_PROPOSALS = 0,
  RETURN_CHESTS = 1,
  MAKE_SECOND_PROPOSALS = 2,
  RETURN_CHESTS_AGAIN = 3,
}

// Dato un elenco di giocatori identificati da una proprietà "code", restituisce due round di proposte univoche da un giocatore all'altro
function generateProposals(players: Player[]) {
  // Crea un array vuoto per memorizzare le proposte
  let proposals = [];
  // Crea una copia dell'elenco dei giocatori per poterli mescolare casualmente
  let shuffledPlayers = [...players];
  // Mescola l'elenco dei giocatori usando l'algoritmo di Fisher-Yates
  for (let i = shuffledPlayers.length - 1; i > 0; i--) {
    // Scegli un indice casuale tra 0 e i
    let j = Math.floor(Math.random() * (i + 1));
    // Scambia gli elementi agli indici i e j
    [shuffledPlayers[i], shuffledPlayers[j]] = [
      shuffledPlayers[j],
      shuffledPlayers[i],
    ];
  }
  // Crea il primo round di proposte usando l'elenco mescolato
  let firstRound = [];
  for (let i = 0; i < shuffledPlayers.length; i++) {
    // Prendi il giocatore alla posizione i
    let proposer = shuffledPlayers[i];
    // Prendi il giocatore alla posizione successiva, cioè (i + 1) modulo la lunghezza dell'elenco
    let proposee = shuffledPlayers[(i + 1) % shuffledPlayers.length];
    // Crea un oggetto che rappresenta la proposta da proposer a proposee
    let proposal = { from: proposer, to: proposee };
    // Aggiungi la proposta al primo round
    firstRound.push(proposal);
  }
  // Aggiungi il primo round alle proposte
  proposals.push(firstRound);
  // Crea il secondo round di proposte usando l'elenco mescolato
  let secondRound = [];
  for (let i = 0; i < shuffledPlayers.length; i++) {
    // Prendi il giocatore alla posizione i
    let proposer = shuffledPlayers[i];
    // Prendi il giocatore alla posizione successiva, cioè (i + 2) modulo la lunghezza dell'elenco
    let proposee = shuffledPlayers[(i + 2) % shuffledPlayers.length];
    // Crea un oggetto che rappresenta la proposta da proposer a proposee
    let proposal = { from: proposer, to: proposee };
    // Aggiungi la proposta al secondo round
    secondRound.push(proposal);
  }
  // Aggiungi il secondo round alle proposte
  proposals.push(secondRound);
  // Restituisci le proposte generate
  return proposals;
}

function currentPhase(chestMoves: number, players: Player[]): PHASE {
  return Math.floor(chestMoves / players.length) % 4;
}

function instructions(chestMoves: number, players: Player[]) {
  switch (currentPhase(chestMoves, players)) {
    case PHASE.MAKE_FIRST_PROPOSALS:
      return "Scansiona i forzieri, uno alla volta, e dalli al giocatore indicato.";
    case PHASE.RETURN_CHESTS:
      return "Scansiona per la seconda volta i forzieri, uno alla volta, e restituiscili al giocatore indicato.";
    case PHASE.MAKE_SECOND_PROPOSALS:
      return "Scansiona per la terza volta i forzieri, uno alla volta, e dalli al giocatore indicato.";
    case PHASE.RETURN_CHESTS_AGAIN:
      return "Scansiona per la quarta volta i forzieri, uno alla volta, e restituiscili al giocatore indicato.";
  }
}

const playerTextClassName = (player: Player) => {
  switch (player.color) {
    case PLAYER_COLOR.BLUE:
      return "font-bold text-blue-500";
    case PLAYER_COLOR.GREEN:
      return "font-bold text-green-500";
    case PLAYER_COLOR.RED:
      return "font-bold text-red-500";
    case PLAYER_COLOR.YELLOW:
      return "font-bold text-yellow-500";
  }
};

const playerIconClassName = (player: Player) => {
  switch (player.color) {
    case PLAYER_COLOR.BLUE:
      return "rounded-full w-12 h-12 ring-2 ring-offset-primary-content bg-blue-500 ring-blue-600";
    case PLAYER_COLOR.GREEN:
      return "rounded-full w-12 h-12 ring-2 ring-offset-primary-content bg-green-500 ring-green-600";
    case PLAYER_COLOR.RED:
      return "rounded-full w-12 h-12 ring-2 ring-offset-primary-content bg-red-500 ring-red-600";
    case PLAYER_COLOR.YELLOW:
      return "rounded-full w-12 h-12 ring-2 ring-offset-primary-content bg-yellow-500 ring-yellow-600";
  }
};

export default function GamePlay() {
  const { value: players } = useContext(PlayersContext);
  const scanner = useContext(ScannerContext);
  const [availableProposals, setAvailableProposals] = useState<Proposal[][]>(
    []
  );
  const [firstProposals, setFirstProposals] = useState<Proposal[]>([]);
  const [secondProposals, setSecondProposals] = useState<Proposal[]>([]);
  const [chestMoves, setChestMoves] = useState(0);
  const [transactionsLog, setTransactionsLog] = useState<ChestTransactions[]>(
    []
  );
  const instructionsModal = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    console.log("Phase:", chestMoves);
    console.log("Chest moves:", chestMoves);
    const mapProposal = (proposal: Proposal) => ({
      from: proposal.from.color,
      to: proposal.to.color,
    });
    if (firstProposals.length) {
      console.log("First proposals:");
      console.table(firstProposals.map(mapProposal));
    }
    if (secondProposals.length) {
      console.log("Second proposals:");
      console.table(secondProposals.map(mapProposal));
    }
    if (availableProposals.length === 2) {
      console.log("Available proposals:");
      console.table(
        [...availableProposals[0], ...availableProposals[1]].map(mapProposal)
      );
    }
  }, [firstProposals, secondProposals, chestMoves]);

  const reset = useCallback(() => {
    setFirstProposals([]);
    setSecondProposals([]);
    setChestMoves(0);
    setTransactionsLog([]);
  }, []);

  const onScan = useCallback(() => {
    scanner.render(
      (code) => {
        let currentlyAvailableProposals: Proposal[][] = [...availableProposals];
        if (!firstProposals.length && !secondProposals.length) {
          currentlyAvailableProposals = generateProposals(players);
          setAvailableProposals(currentlyAvailableProposals);
        }

        const phase = currentPhase(chestMoves, players);

        const chestOwner = players.find((player) => player.code === code);

        switch (phase) {
          case PHASE.MAKE_FIRST_PROPOSALS:
            const firstProposalIndex = currentlyAvailableProposals[0].findIndex(
              (proposal) => proposal.from.code === code
            );
            const newFirstProposal = currentlyAvailableProposals[0].splice(
              firstProposalIndex,
              1
            )[0];
            console.log(
              "%s: %s → %s",
              newFirstProposal.from.code,
              newFirstProposal.from.color,
              newFirstProposal.to.color
            );
            setFirstProposals([...firstProposals, newFirstProposal]);
            setAvailableProposals(currentlyAvailableProposals);
            setTransactionsLog([
              {
                from: newFirstProposal.from,
                to: newFirstProposal.to,
              },
              ...transactionsLog.slice(0, players.length * 4 - 2),
            ]);
            break;
          case PHASE.MAKE_SECOND_PROPOSALS:
            const secondProposalIndex =
              currentlyAvailableProposals[1].findIndex(
                (proposal) => proposal.from.code === code
              );
            const newSecondProposal = currentlyAvailableProposals[1].splice(
              secondProposalIndex,
              1
            )[0];
            console.log(
              "%s: %s → %s",
              newSecondProposal.from.code,
              newSecondProposal.from.color,
              newSecondProposal.to.color
            );
            setSecondProposals([...secondProposals, newSecondProposal]);
            setAvailableProposals(currentlyAvailableProposals);
            setTransactionsLog([
              {
                from: newSecondProposal.from,
                to: newSecondProposal.to,
              },
              ...transactionsLog.slice(0, players.length * 4 - 2),
            ]);
            break;
          case PHASE.RETURN_CHESTS:
          case PHASE.RETURN_CHESTS_AGAIN:
            console.log("%s → %s", chestOwner.code, chestOwner.color);
            setTransactionsLog([
              {
                to: chestOwner,
              },
              ...transactionsLog.slice(0, players.length * 4 - 2),
            ]);
            break;
        }

        let updatedChestMoves = chestMoves + 1;
        setChestMoves(updatedChestMoves);

        if (instructionsModal.current) {
          instructionsModal.current.showModal();
        }

        if ((updatedChestMoves % players.length) * 4 === 0) {
          setFirstProposals([]);
          setSecondProposals([]);
        }
      },
      (error) => console.error(error)
    );
  }, [
    players,
    availableProposals,
    firstProposals,
    secondProposals,
    chestMoves,
  ]);

  const renderTransactionForModal = (instructions: ChestTransactions) => {
    const verb = instructions.from ? "Dai" : "Restituisci";
    return (
      <>
        {/* <div className={playerIconClassName(instructions.to)}></div> */}
        <p className="prose prose-lg text-center my-0">
          {verb} il forziere scansionato al giocatore{" "}
          <span className={playerTextClassName(instructions.to)}>
            {instructions.to.color}
          </span>
        </p>
      </>
    );
  };

  const renderTransactionForBacklog = (instructions: ChestTransactions) => {
    const verb = instructions.from ? "Hai dato" : "Hai restituito";
    return (
      <>
        {verb} un forziere al giocatore{" "}
        <span className={playerTextClassName(instructions.to)}>
          {instructions.to.color}
        </span>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <div className="flex flex-row items-center justify-center">
        {players.map((player, i) => (
          <>
            <div className={playerIconClassName(player)}></div>
            {i < players.length - 1 && <div className="w-6" />}
          </>
        ))}
      </div>
      <p className="prose prose-lg text-center py-6 my-0">{instructions(chestMoves, players)}</p>
      <ul className="list-none prose prose-sm m-0 px-4 text-center overflow-y-auto flex-grow pb-28">
        {transactionsLog.map((t, index) => (
          <li key={index} className="">
            {renderTransactionForBacklog(t)}
          </li>
        ))}
      </ul>
      <div className="flex flex-row items-center justify-center fixed bottom-0 p-4">
        <button className="btn btn-primary" onClick={onScan}>
          Scansiona
        </button>
        <div className="w-4" />
        <button className="btn btn-warning" onClick={reset}>
          Reset
        </button>
        <div className="w-4" />
        <ClearGameButton />
      </div>
      <dialog id="instructions-modal" ref={instructionsModal} className="modal">
        <div className="modal-box flex flex-col items-center justify-center">
          {transactionsLog.length &&
            renderTransactionForModal(transactionsLog[0])}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary">Continua</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
