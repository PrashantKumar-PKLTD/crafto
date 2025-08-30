import React from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import Features from '../components/Features';
import PDFPreview from '../components/PDFPreview';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <>
      <Hero />
      <Categories />
      <PDFPreview />
      <Features />
      <Contact />
    </>
  );
};

export default Home;