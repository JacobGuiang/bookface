import { useState } from 'react';
import RegisterModal from './RegisterModal';

const RegisterButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}> Create new account</button>
      {showModal && <RegisterModal />}
    </div>
  );
};

export default RegisterButton;
