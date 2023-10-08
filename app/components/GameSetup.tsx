import ClearGameButton from "./ClearGameButton";
import PlayersSetupList from "./PlayersSetupList";
import StartGameButton from "./StartGameButton";

export default function GameSetup() {
  return (
    <>
      <p className="py-2 px-4 my-0">
        Scansiona i forzieri dei giocatori che partecipano alla partita:
      </p>
      <PlayersSetupList />
      <div className="flex flex-row items-center justify-center w-screen py-4 px-4">
        <StartGameButton />
        <div className="w-4" />
        <ClearGameButton />
      </div>
    </>
  );
}
