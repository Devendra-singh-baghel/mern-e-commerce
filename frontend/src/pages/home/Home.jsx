import React from 'react'
import "./Home.css"
import Footer from '../../components/footer/Footer'
import Navbar from '../../components/navbar/Navbar'
import ImageSlider from '../../components/image_slider/ImageSlider'

function Home() {
    return (
        <>
            <Navbar />
            <ImageSlider />
            <div className="home-container">
                <h2 className='home-heading'>Tranding Now</h2>
            </div>
            <Footer />
        </>
    )
}

export default Home
