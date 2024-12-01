import { useContext, useState } from "react";
import { createConversation } from "../../../components/api/conversation";
import { AuthContext } from "../../../components/context/AuthContext";
import CoreBase from "../base";
import { Button, Input, Textarea } from "@headlessui/react";

const CreateConversationPage = () => {
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name || !description) {
      setError("Please fill out all fields");
      return;
    }

    try {
      const { id } = await createConversation({ name, description });
      setUrl(`${window.location.origin}/conversation/${id}`);
    } catch (e) {
      setError("Failed to create conversation");
    }
  };

  return (
    <CoreBase>
      <div className="w-full h-full flex justify-center">
        <div className="w-full md:w-1/2 flex flex-col items-start p-4">
          <h1 className="text-4xl font-bold mb-8">Create Conversation</h1>
          {error && (
            <div className="bg-red-500 text-white p-2 rounded-md mb-4 absolute top-16">
              {error}
            </div>
          )}
          <p className="mb-4">
            Author: <span className="font-bold">{user?.username}</span> (you)
          </p>
          <Input
            className="mb-4 p-2 rounded-md bg-gray-100 w-full"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            className="mb-8 p-2 rounded-md bg-gray-100 h-48 w-full"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            className="bg-sky-500 text-white rounded p-2 w-1/3"
            onClick={handleCreate}
          >
            Create
          </Button>
          {url && (
            <p className="mt-4">
              Conversation created! Share this link with others:
              <br />
              <a
                href={url}
                target="_blank"
                className="text-sky-500 ml-2 underline"
              >
                {url}
              </a>
            </p>
          )}
        </div>
      </div>
    </CoreBase>
  );
};

export default CreateConversationPage;
