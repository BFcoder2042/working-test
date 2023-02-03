import * as React from 'react';
import '../attestation/components/styles/stats.scss';

const Stats = (props) => {

  const iframeUrl = "https://app.powerbi.com/reportEmbed?reportId=b01f0d49-b101-40dd-b100-61cb133604f8&autoAuth=true&ctid=7ce83bea-9f48-4720-966f-6abbbe073228&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtZXVyb3BlLWUtcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D";

  return(
    <div className='stats'>
      <iframe src={iframeUrl} width={'100%'} height={'100%'}></iframe>
    </div>
  )
}

export default Stats;

