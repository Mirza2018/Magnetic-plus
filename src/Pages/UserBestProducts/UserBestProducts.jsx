import React from 'react';
import useAxiousPublic from '../../Hooks/useAxiousPublic';
import { useQuery } from '@tanstack/react-query';
import useItems from '../../Hooks/useItems';
import FeaturedProducts from '../FeaturedProducts/FeaturedProducts';

const UserBestProducts = () => {
    const axiousPublic = useAxiousPublic()
    const [items] = useItems()

    const { data: bestProducts = [] } =
        useQuery({
            queryKey: ['bestProducts'],
            queryFn: async () => {
                const res = await axiousPublic.get("/bestProducts");
                return res.data;

            }
        })
    const dataArray = bestProducts[0]?.data
    const filterItems = [];

    dataArray?.forEach(d => {
        items.map(item => {

            if (item._id == d) {
                filterItems.push(item)
            }

        })
    })


    // console.log(filterItems);





    return (
        <div>
            <div className="text-center max-w-screen-2xl container mx-auto xl:px-28 px-4">
                <h2 className="text-2xl font-bold capitalize flex mb-5">
                    Best Selling Products:
                </h2>
                {/* <p className="text-black/75 capitalize md:w-2/3 mx-auto mb-8"> </p> */}
            </div>
            <FeaturedProducts products={filterItems} ></FeaturedProducts>

        </div >
    );
};

export default UserBestProducts;