import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { leadsAPI } from '../utils/api';
import LeadForm from '../components/LeadForm';

export default function AddLead() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await leadsAPI.create(data);
      toast.success('Lead created successfully!');
      navigate('/leads');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LeadForm
      onSubmit={handleSubmit}
      onCancel={() => navigate('/leads')}
      loading={loading}
    />
  );
}
