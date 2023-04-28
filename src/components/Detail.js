import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import starshipImages from '../data.json'

function Detail() {
  const navigate = useNavigate(); // Sayfalar arasında geçiş yapmamızı sağlayan react-router-dom kütüphanesinden useNavigate hook'u
  const { model } = useParams(); // Adreste yer alan parametreleri alabilmemizi sağlayan useParams hook'u
  const [starship, setStarship] = useState(null); // Starship bilgisini state olarak tutacağımız için useState hook'u kullanıyoruz
  const detailData = starshipImages.find((starship) => starship.id === model); // Veri setindeki starship bilgisini id'ye göre arayarak detay sayfasında göstermek için kullanacağımız görseli alıyoruz
  const findImage = detailData?.image || 'a wing'; // DetailData değişkeninin içinde image bilgisi varsa onu, yoksa "a wing" görselini kullanıyoruz

  useEffect(() => {
    const fetchStarship = async () => {
      const url = `https://swapi.dev/api/starships/?search=${model}`; // Starship bilgisini çekeceğimiz API endpoint'i
      const response = await axios.get(url); // API'den veriyi çekiyoruz
      setStarship(response.data.results[0]); // Gelen veriden ilk öğeyi setStarship hook'u ile state'e atıyoruz
    };
    fetchStarship(); // Fetch işlemini useEffect ile component render edildiğinde yapıyoruz
  }, [model]); // useEffect hook'unun dependency array'ine model değişkenini ekliyoruz

  return (
    <div className='detail'>
      <button class="close" onClick={() => navigate(-1)}></button> {/*Detay sayfasından çıkış butonu*/}
      <div className='detail-left'>
        <img src={require(`../assets/starships_images/${findImage}.png`)} alt="" /> {/*Detay sayfasında starship görseli*/}
      </div>
      <div className='detail-right'>
        {starship && ( // Starship bilgisi state'te null değilse detay sayfasındaki bilgileri gösteriyoruz
          <div>
            <h1>{starship.name}</h1>
            <hr></hr>
            <br></br>
            <h3>Model: {starship.model}</h3>
            <h3>Hyperdrive Rating: {starship.hyperdrive_rating}</h3>
            <h3>Passengers: {starship.passengers}</h3>
            <h3>Max Atmosphering Speed: {starship.max_atmosphering_speed}</h3>
            <h3>Manufacturer: {starship.manufacturer}</h3>
            <h3>Crew: {starship.crew}</h3>
            <h3>Cargo Capacity: {starship.cargo_capacity}</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Detail;
