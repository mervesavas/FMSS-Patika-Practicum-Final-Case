import React, { useState, useEffect } from 'react';
import image from '../assets/swbc.jpeg';
import buton from '../assets/buton.png';
import Card from './Card';
import axios from 'axios'

function Main() {
  //burada state değişkenlerimizi tanımladım.
  const [starships, setStarships] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1)
  const [totalPage, setTotalPage] = useState([])
  const [searchInput, setSearchInput] = useState('');
  const [isSearched, setIsSearched] = useState(false)

  let pageNumbers = [];

  //Bu fonksiyon kullanıldığında sayfa 1 e çekilir ve arama falsea döner. 
  const handleClear = () => {
    setCurrentPage(1)
    setIsSearched(false)
  }
  
  //Bu fonksiyon, sayfalama için kullanılan sayfa numaraları düğmelerine tıklanıldığında çalışır. 
  const handleClick = (event) => {
    if (isSearched) {
      setSearchPage(Number(event.target.id))
    }
    else {
      setCurrentPage(Number(event.target.id))
    } //Eğer isSearched değişkeni false ise, normal sayfalama için kullanılır ve setCurrentPage fonksiyonu çağrılarak tıklanan sayfanın numarası currentPage state'ine atanır.
  }

  const handlePrevClick = async () => {
    if (currentPage > 1) {
      if (isSearched) {  // Eğer mevcut sayfa sayısı 1'den büyükse, sayfayı bir önceki sayfaya taşır.
        setSearchPage(searchPage - 1)
      }
      else {
        setCurrentPage(currentPage - 1)
      }
    }
  };

  const handleNextClick = async () => {
    // Eğer kullanıcı arama yapmışsa, arama sonuçları sayfalarına göre gösteriliyorsa ve mevcut sayfanın ardından bir sayfa varsa tıklandığında sayfa bir arttırılır.
    if (isSearched && (totalPage.length - 1 >= searchPage)) {
      setSearchPage(searchPage + 1)
    }
    else {  //mevcut sayfa ardından bir sayfa varsa, sayfayı bir arttırır ve yeni verileri getirir.
      if (totalPage.length - 1 >= currentPage) {
        setCurrentPage(currentPage + 1)
      }
    }
  };

  useEffect(() => {
    if (isSearched) {  //isSearched state'i true ise, axios ile arama kutusunda girilen kelimeye göre gemileri arar ve searchPage state'ine göre sonuçları sayfalara ayırır.
      axios.get(`https://swapi.dev/api/starships/?search=${searchInput}&page=${searchPage}`)
        .then((res) => {
          if (res.data.count === 0) {
            setStarships(null);
          } else {
            setStarships([...res.data.results]);
            console.log(res.data)
            for (let i = 1; i <= (res.data.count / 10) + 1; i++) {
              pageNumbers.push(i);
            }
            setTotalPage(pageNumbers)
          }
        })
    }
    else { //Eğer isSearched false ise, tüm gemileri currentPage state'ine göre sayfalara ayırır. pageNumbers dizisi sayfa numaralarının düzenlenmesi için kullanılır ve totalPage state'ine atanır.
      axios.get(`https://swapi.dev/api/starships/?page=${currentPage}`)
        .then(response => {
          setStarships([...response.data.results])
          for (let i = 1; i <= (response.data.count / 10) + 1; i++) {
            pageNumbers.push(i);
          }
          setTotalPage(pageNumbers)
        })
        .catch(error => {
          console.log(error);
        });
    }


  }, [currentPage, searchPage, isSearched]); //currentPage, searchPage veya isSearched statelerinde herhangi bir değişiklik olduğunda çalışır.

  const handleSearch = async (e) => {
    e.preventDefault();
    pageNumbers = []
  
    // Eğer searchInput boş ise, isSearched durumunu false yap
    if (searchInput === '') {
      setIsSearched(false)
    } else {
      setIsSearched(true)
    }
  
    // Search sayfasını 1 olarak ayarla
    setSearchPage(1)
  
    // Starships dizisini boşalt
    setStarships([])
  
    // Swapi'den arama yap
    const res = await axios.get(`https://swapi.dev/api/starships/?search=${searchInput}&page=${searchPage}`);
  
    // Arama sonucunda veri yoksa starships dizisini null olarak ayarla
    if (res.data.count === 0) {
      setStarships(null);
    } else {
      setStarships(res.data.results);
      
      // Sayfa numaralarını hesapla ve pageNumbers dizisine ekle
      for (let i = 1; i <= (res.data.count / 10) + 1; i++) {
        pageNumbers.push(i);
      }
  
      // Toplam sayfa sayısını ayarla
      setTotalPage(pageNumbers)
    }
  
    // SearchInput değerini sıfırla
    setSearchInput('')
  };   

  return (
    <>
      <div className='header'>
        <div className='bg'>
          <img src={image} alt=""></img>
        </div>
        <div className='search-bar'>
          <form onSubmit={handleSearch}>
            <input type='search'
              placeholder='Search'
              className='search'
              value={searchInput}
              onFocus={(e) => e.target.placeholder = ''}
              onBlur={(e) => e.target.placeholder = 'Search'}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch(e);
                }
              }}
            />
            <button onClick={handleSearch}>
              <img src={buton} alt='buton'></img>
            </button>
          </form>

        </div>
      </div>

      <div className="content">
        {starships === null ? (
          <div className='homebuton'>
            <p>Starship is not found.</p>
            <button className="home" onClick={handleClear}>
              ANASAYFA
            </button>
          </div>
        ) : starships.length === 0 ? (
          <div class="ring">Loading
            <span></span>
          </div>
        ) : (
          <Card data={starships} />
        )}
      </div>
      {starships !== null && (
        <div className="pagination">
          <button onClick={handlePrevClick}>⇦</button>
          {totalPage.map((number) => (
            <button
              key={number}
              id={number}
              onClick={handleClick}
              className={
                isSearched
                  ? searchPage === number
                    ? "active"
                    : ""
                  : currentPage === number
                    ? "active"
                    : ""
              }
            >
              {number}
            </button>
          ))}
          <button onClick={handleNextClick}>⇨</button>
          {isSearched && (
            <button onClick={handleClear}>ANASAYFA</button>
          )}
        </div>
      )}


    </>
  );
}

export default Main;