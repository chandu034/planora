import React, { useState } from 'react';
import {
  Typography,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { firestore } from '../firebase';
import { collection, addDoc, query, where, getDocs } from '@firebase/firestore';
import styled from 'styled-components';
import DateSelector from './DateSelector';
import PlannerForm from './PlannarForm';

const { Title } = Typography;

const Container = styled.div`
  padding: 20px;
`;

const PlanaDay = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [activities, setActivities] = useState([]);

  const fetchActivitiesForDate = async (dateString) => {
    try {
      const ref = collection(firestore, 'activities');
      const q = query(ref, where('date', '==', dateString));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map(doc => doc.data());
      const sorted = data.sort((a, b) =>
        dayjs(a.timeRange[0], 'HH:mm').diff(dayjs(b.timeRange[0], 'HH:mm'))
      );

      setActivities(sorted);
    } catch (error) {
      console.error('Error fetching activities:', error);
      message.error('Failed to load activities');
    }
  };

  const handleAddActivity = async (values, form) => {
    const [startNew, endNew] = values.timeRange.map(t => t.format('HH:mm'));
    const newActivity = {
      date: selectedDate.format('YYYY-MM-DD'),
      timeRange: [startNew, endNew],
      name: values.activity,
      priority: values.priority,
    };

    const isConflict = activities.some((act) => {
      const [startOld, endOld] = act.timeRange;

      return (
        (startNew >= startOld && startNew < endOld) ||
        (endNew > startOld && endNew <= endOld) ||
        (startNew <= startOld && endNew >= endOld)
      );
    });

    if (isConflict) {
      message.error('Time range conflicts with an existing activity.');
      return;
    }

    try {
      const ref = collection(firestore, 'activities');
      await addDoc(ref, newActivity);
      message.success('Activity added!');
      form.resetFields();

      setActivities((prev) =>
        [...prev, newActivity].sort((a, b) =>
          dayjs(a.timeRange[0], 'HH:mm').diff(dayjs(b.timeRange[0], 'HH:mm'))
        )
      );
    } catch (error) {
      console.error('Error adding activity:', error);
      message.error('Failed to add activity');
    }
  };

  return (
    <Container>
      <Title level={2}>Plan Your Day</Title>

      {!selectedDate ? (
        <DateSelector
          onSelect={(date) => {
            setSelectedDate(date);
            fetchActivitiesForDate(date.format('YYYY-MM-DD'));
          }}
        />
      ) : (
        <PlannerForm
  selectedDate={selectedDate}
  activities={activities}
  onAddActivity={handleAddActivity}
  onBack={() => setSelectedDate(null)}
/>
      )}
    </Container>
  );
};

export default PlanaDay;
