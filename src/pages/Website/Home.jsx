import React, { useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import Platforms from './Platforms';
import Markets from './Markets';
import AccountTypes from './AccountTypes';
import Funding from './Funding';
import Partners from './Partners';
import Contact from './Contact';
import Footer from './Footer';
import AccountModal from './AccountModal';

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="website">
      <Navbar onOpenModal={openModal} />
      <Hero onOpenModal={openModal} />
      <Features />
      <Platforms />
      <Markets />
      <AccountTypes onOpenModal={openModal} />
      <Funding />
      <Partners />
      <Contact />
      <Footer />
      
      <AccountModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default Home;