import CoreBase from '../../app/core/base';

export const ConversationNotFound = () => {
  return (
    <CoreBase>
      <div className='flex flex-col items-center justify-center h-full p-4'>
        <h2 className='text-2xl font-semibold mb-4'>Conversation not found</h2>
        <p className='text-center text-gray-600'>
          The conversation you are looking for does not exist or has been
          deleted.
        </p>
      </div>
    </CoreBase>
  );
};
