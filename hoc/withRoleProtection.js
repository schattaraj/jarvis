import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getRoleFromToken } from '../utils/auth'; // Import the function we just created

// HOC to protect routes based on roles
const withRoleProtection = (WrappedComponent, allowedRoles) => {
  const Wrapper = (props) => {
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);
    const router = useRouter();

    useEffect(() => {
      const role = getRoleFromToken();  // Get the role from the decoded JWT
      setRole(role);
      setLoading(false);

      if (!role || !allowedRoles.includes(role)) {
        // If no role or role is not allowed, redirect to login or home
        router.push('/login'); // Change this to your desired route
      }
    }, []);

    if (loading) {
      return <p>Loading...</p>;  // Or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withRoleProtection;
