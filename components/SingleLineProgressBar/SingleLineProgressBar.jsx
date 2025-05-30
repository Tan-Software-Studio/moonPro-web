import React from 'react';

const SingleLineProgressBar = ({
  value = 0,
  maxValue = 100,
  height = 2,
  trailColor = '#2a2d33',
  progressColor = '#4FAFFE',
  width = '100%',
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div style={{ width, backgroundColor: trailColor, height, borderRadius: 1 }}>
      <div
        style={{
          width: `${percentage}%`,
          backgroundColor: progressColor,
          height: '100%',
          borderRadius: 1,
        }}
      />
    </div>
  );
};

export default SingleLineProgressBar;
