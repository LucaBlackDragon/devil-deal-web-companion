import { useCallback, useContext, useEffect, useState } from "react";
import ClearGameButton from "./ClearGameButton";
import { PlayersContext, ScannerContext } from "../context";
import { Player } from "../models";

type Proposal = {
  from: Player;
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

function instructions(phase: PHASE) {
  switch (phase) {
    case PHASE.MAKE_FIRST_PROPOSALS:
      return "Scansiona i forzieri uno alla volta e dalli al giocatore indicato:";
    case PHASE.RETURN_CHESTS:
      return "Scansiona i forzieri uno alla volta e restituiscili al giocatore indicato:";
    case PHASE.MAKE_SECOND_PROPOSALS:
      return "Scansiona di nuovo i forzieri uno alla volta e dalli al giocatore indicato (diverso dal primo round):";
    case PHASE.RETURN_CHESTS_AGAIN:
      return "Scansiona di nuovo i forzieri uno alla volta e restituiscili al giocatore indicato:";
  }
}

export default function GamePlay() {
  const { value: players } = useContext(PlayersContext);
  const scanner = useContext(ScannerContext);
  const [availableProposals, setAvailableProposals] = useState<Proposal[][]>(
    []
  );
  const [firstProposals, setFirstProposals] = useState<Proposal[]>([]);
  const [secondProposals, setSecondProposals] = useState<Proposal[]>([]);
  const [phase, setPhase] = useState<PHASE>(PHASE.MAKE_FIRST_PROPOSALS);
  const [chestMoves, setChestMoves] = useState(0);
  const [targetPlayer, setTargetPlayer] = useState<Player | null>(null);

  useEffect(() => {
    console.log("Phase:", phase);
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
  }, [firstProposals, secondProposals, phase, chestMoves]);

  const reset = useCallback(() => {
    setFirstProposals([]);
    setSecondProposals([]);
    setPhase(PHASE.MAKE_FIRST_PROPOSALS);
    setChestMoves(0);
  }, []);

  const onScan = useCallback(() => {
    scanner.render(
      (code) => {
        let currentlyAvailableProposals: Proposal[][] = [...availableProposals];
        if (!firstProposals.length && !secondProposals.length) {
          currentlyAvailableProposals = generateProposals(players);
          setAvailableProposals(currentlyAvailableProposals);
        }

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
            setTargetPlayer(newFirstProposal.to);
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
            setTargetPlayer(newSecondProposal.to);
            break;
          case PHASE.RETURN_CHESTS:
          case PHASE.RETURN_CHESTS_AGAIN:
            console.log("%s → %s", chestOwner.code, chestOwner.color);
            setTargetPlayer(chestOwner);
            break;
        }

        let updatedChestMoves = chestMoves + 1;
        let updatedPhase = phase;
        if (updatedChestMoves === players.length) {
          updatedChestMoves = 0;
          updatedPhase = phase + 1;
        }
        if (updatedPhase > PHASE.RETURN_CHESTS_AGAIN) {
          updatedPhase = PHASE.MAKE_FIRST_PROPOSALS;
          setFirstProposals([]);
          setSecondProposals([]);
          setTargetPlayer(null);
        }
        setChestMoves(updatedChestMoves);
        setPhase(updatedPhase);
      },
      (error) => console.error(error)
    );
  }, [
    players,
    availableProposals,
    firstProposals,
    secondProposals,
    phase,
    chestMoves,
  ]);

  return (
    <div className="flex flex-col items-center justify-center w-screen">
      <p>{instructions(phase)}</p>
      {targetPlayer && (
        <p>dai il forziere scansionato al giocatore {targetPlayer.color}</p>
      )}
      <div className="flex flex-row items-center justify-center w-screen">
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
    </div>
  );
}
