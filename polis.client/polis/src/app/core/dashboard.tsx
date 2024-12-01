import FullLogo from "../../assets/pol.is_.webp";
import CoreBase from "./base";

const DashboardPage = () => (
  <CoreBase>
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="flex flex-col items-center h-full w-1/3">
        <img src={FullLogo} alt="Polis Logo" className="h-32 w-32 mb-8 mt-14" />
        <h2 className="text-4xl font-bold mb-8">Welcome to Polis!</h2>
        <p className="mb-4">You are logged in.</p>
        <p>Start or participate in a conversation.</p>
        <a href="/create">
          <button className="bg-sky-500 text-white rounded-md p-2 mt-4">
            Start a Conversation
          </button>
        </a>
      </div>
    </div>
  </CoreBase>
);

export default DashboardPage;
