/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-no-duplicate-props */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TermPill, TermCard, Loading, EmptyMessage, SearchBar } from '../../components';
import './Home.css';
import { PlusSvg } from '../../icons';
import useAuth from '../../hooks/useAuth';

function Home() {
  const { isLoggedIn } = useAuth();
  const [randomTerms, setRandomTerms] = useState(null);
  const [newTerms, setNewTerms] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  
  useEffect(() => {
    const firstTimeFetchData = async () => {
      setIsLoading(true);
      try {
        const responseRandomTerms = await axios.get('https://kbti-api.herokuapp.com/terms/random');
        const responseNewTerms = await axios.get('https://kbti-api.herokuapp.com/terms/new');
        const [randomTermsRes, newTermsRes] = await axios.all([responseRandomTerms, responseNewTerms]);
        setRandomTerms(randomTermsRes.data);
        setNewTerms(newTermsRes.data);
        setIsLoading(false);
      } catch (error) {
        const statusErrorMessage = error.response.status;
        
        if (statusErrorMessage === 500) {
          setIsLoading(false);
          return setErrorMessage('Terjadi kesalahan pada server, mohon coba lagi!');
        }
        
        setErrorMessage('Data definisi tidak ditemukan!');
        setIsLoading(false);
      }
    };
    
    firstTimeFetchData();
  }, []);
  
  const randomTermElements = randomTerms && !errorMessage && randomTerms?.data?.map((definition) => {
    return <TermCard key={definition.id} dataDefinition={definition} />;
  });

  return (
    <div className="homepage">
      <SearchBar />
      <div className="term___container">
        <div className="row gx-5 row-cols-2">
          <div className="new-term__container col-12 col-lg-4 mt-4 mb-4">
            <p>Istilah yang baru ditambahkan</p>
            {isLoading && <Loading />}
            {errorMessage && <p className="text-center fw-bold">{errorMessage}</p>}
            <div className="new-term__pils">
              {newTerms && !errorMessage && newTerms?.data?.map((newTerm, index) => {
                return <TermPill key={`${index}newTerms`} term={newTerm.term} />;
              })}
            </div>
            <Link
              to={isLoggedIn ? '/definitions/create' : '/login'}
              className="add-term__button btn btn-kbti w-100 rounded-pill pt4 my-1 me-3 align-middle lh-lg"
              role="button"
            >
              <PlusSvg className="me-2" />
              <span className="btn-text">Tambah istilah baru</span>
            </Link>
          </div>
          <div className="random-term___container col-12 col-lg-8 mt-4">
            {isLoading && <Loading />}
            {errorMessage && <EmptyMessage message={`${errorMessage}, terjadi kesalahan`} />}
           {randomTermElements}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
