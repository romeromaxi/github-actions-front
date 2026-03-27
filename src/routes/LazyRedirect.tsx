import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/contexts/UserContext';
import { LoaderBlockUI } from '../components/loader';
import React from 'react';

export default function LazyRedirect() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRedirect(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (shouldRedirect) {
      navigate('/', { replace: true });
    }
  }, [shouldRedirect, navigate, user]);

  return <LoaderBlockUI />;
}