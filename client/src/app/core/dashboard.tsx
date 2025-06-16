import CoreBase from './base';

const DashboardPage = () => (
  <CoreBase>
      <div className='flex flex-col items-start h-full p-10'>
        <div id="heading" className='flex w-full justify-between'>
          <div id="hdeading-text">
            <h1 className='text-5xl font-bold mb-8'>Conversations</h1>
      <h2>Start or participate in a conversation.</h2>
          </div>
          <a className='mb-8 p-2 bg-secondary text-white rounded-md h-fit' href='/conversation/new'>+ Create conversation</a>
        </div>
    </div>
  </CoreBase>
);

export default DashboardPage;
