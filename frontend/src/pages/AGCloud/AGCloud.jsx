import React from 'react';
import Header from '../../components/AGCloud/Header/Header';
import MainTutorialGuideTab from '../../components/AGCloud/tutorialguidetab/tutorialguidetab';
import MainProjectTab from '../../components/AGCloud/MyProjectTab/MyProjectTab';

function AGCloudPage() {
  return (
    <div>
      <Header />
      <MainProjectTab />
      <MainTutorialGuideTab />
    </div>
  );
}

export default AGCloudPage;
