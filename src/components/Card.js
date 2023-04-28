import React from 'react'
import { useNavigate } from 'react-router-dom'
import starshipImages from '../data.json'

function Card({ data }) {
    let navigate = useNavigate(); //Sayfa yönlendirmesi için hook kullandım.
    return (
        <>
            {
                (data) ? (
                    data.map(item => {  //map ile datada geziliyor ve iteme atılıyor. 
                        //.find ile oluşturduğum json dosyasından modeline göre ilgili görüntüyü buluyorum.
                        const findImage = starshipImages.find(resim => resim.id === item.model)?.image || '../starships_images/a wing.png';
                        return (  //Kartları oluşturdum. Gösterilecek bilgileri çağırdım.
                            <div className='card' key={item.id} onClick={() => navigate(`/${item.model}`)}>
                                <img src={require(`../assets/starships_images/${findImage}.png`)} alt="" />
                                <div className='description'>
                                    <h3>{item.name}</h3>
                                    <p>Model: {item.model}</p>
                                    <p className='hr'>{item.hyperdrive_rating}</p>
                                </div>
                            </div>
                        )
                    })
                ) : ""
            }
        </>
    )
}

export default Card;
