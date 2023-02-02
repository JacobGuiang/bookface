import { useParams } from 'react-router-dom';

const User = () => {
  const { id } = useParams();

  // TODO

  return (
    <div>
      <div>{id}</div>
    </div>
  );
};

export default User;
