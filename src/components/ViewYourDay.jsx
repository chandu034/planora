import React, { useState } from 'react';
import { DatePicker, Typography, Divider, Tag, Spin, message } from 'antd';
import { firestore } from '../firebase';
import { collection, query, where, getDocs } from '@firebase/firestore';
import dayjs from 'dayjs';

const { Title } = Typography;

const PRIORITY_COLORS = {
  important: 'red',
  urgent: 'orange',
  normal: 'green',
  'not important': 'default',
};

const ViewYourDay = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchActivities = async (date) => {
    setLoading(true);
    setActivities([]);
    try {
      const formattedDate = date.format('YYYY-MM-DD');
      const ref = collection(firestore, 'activities');
      const q = query(ref, where('date', '==', formattedDate));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => doc.data());

      const sorted = data.sort((a, b) =>
        dayjs(a.timeRange[0], 'HH:mm').diff(dayjs(b.timeRange[0], 'HH:mm'))
      );

      setActivities(sorted);
    } catch (error) {
      console.error('Error fetching activities:', error);
      message.error('Failed to fetch activities');
    }
    setLoading(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) fetchActivities(date);
  };

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>View Your Day</Title>

      <DatePicker onChange={handleDateChange} />

      {loading ? (
        <Spin style={{ marginTop: 20 }} />
      ) : (
        <>
          <Divider />
          {selectedDate && activities.length === 0 ? (
            <p>No activities found for {selectedDate.format('YYYY-MM-DD')}</p>
          ) : (
            activities.map((act, index) => (
              <div
                key={index}
                style={{
                  padding: '10px 12px',
                  marginBottom: 10,
                  border: `1px solid #d9d9d9`,
                  borderLeft: `4px solid ${PRIORITY_COLORS[act.priority]}`,
                  borderRadius: 4,
                  background: '#fafafa',
                }}
              >
                <strong>
                  {act.timeRange[0]} - {act.timeRange[1]}
                </strong>
                <br />
                {act.name}
                <br />
                <Tag color={PRIORITY_COLORS[act.priority]} style={{ marginTop: 5 }}>
                  {act.priority.toUpperCase()}
                </Tag>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default ViewYourDay;
