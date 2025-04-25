import axios from 'axios'
import { useState } from 'react'

export default function RestaurantList(){
    const [restaurant, setRestaurant] = useState([]);

    async function GetRestaurantList(){
        const response = await axios.get('API HTTPS')
        setRestaurant(response.data)
    }

    return (
        <>
        <h1>List of something</h1>
        </>
    )
}