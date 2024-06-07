import { FaTrashAlt } from "react-icons/fa";
import useCart from "../../../Hooks/useCart";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useContext } from "react";
import { AuthContext } from "../../../Providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";



const cart = () => {
    const { user } = useContext(AuthContext)
    const axiosSecure = useAxiosSecure();
    const [addToCart, againFetch] = useCart()
    const navigate = useNavigate()

    let date = new Date().toJSON().slice(0, 10).replace(/-/g, '/');

    let totalPrice = addToCart.reduce((acc, item) => {
        // Use a default quantity of 1 if quantity is not provided or is zero
        const quantity = item.quantity || 1;
        return acc + (item.price * quantity);
    }, 0);

    const handleDelete = id => {
        Swal.fire({
            title: 'Delete!!',
            text: 'Are you want to delete this item',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete!'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/addtocart/${id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            againFetch()
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: `Deleted`,
                                showConfirmButton: false,
                                timer: 700
                            })

                        }
                    })
            }
        })

    }

    const handleOrder = async () => {

        const { value: formValues } = await Swal.fire({
            title: "Give Some Information",
            html: `
            <p>Mobile Number</p>
              <input  type="text" id="mobile" placeholder="017--" className="swal2-input">
              <p>Delivery address</p>
              <input  type="text" id="address" placeholder="জেলা,থানা, জায়গার নাম, রোড নং, বাড়ির  নাম " className="swal2-input">
            `,
            showCancelButton: true,
            confirmButtonText: "Make a Order",
            preConfirm: () => {
                return [
                    { va1: document.getElementById("mobile").value },
                    { va2: document.getElementById("address").value }
                ];
            }
        });

        const mobileNumber = formValues[0].va1;
        const deliveryAddress = formValues[1].va2;

        console.log("Mobile Number:", mobileNumber);
        console.log("Delivery Address:", deliveryAddress);
        if (mobileNumber.length > 10 && deliveryAddress.length > 10) {
            const orderDetails = {
                email: user.email, name: user.displayName, photo: user?.photoURL, orderItems: addToCart,
                mobileNumber, deliveryAddress, date, totalPrice, status: "waiting for confirmation"
            }
            console.log(orderDetails);
            const orderRes = await axiosSecure.post('/orders', orderDetails)

            if (orderRes.data.insertedId) {
                Swal.fire({
                    position: "center",
                    title: `আপনার Order টি সম্পন্ন হয়েছে`,
                    text: ` Order ID ${orderRes.data.insertedId}. 
                    আমাদের প্রতিনিধি কিছুক্ষনের মধ্যে আপনার সাথে যোগাযোগ করবে। Magnetic-Plus এর সাথে থাকার জন্য ধন্যবাদ।
                    `,
                    icon: "success",
                    showConfirmButton: false,
                    timer: 15000
                });


                addToCart.map(cart => {
                    axiosSecure.delete(`/addtocart/${cart._id}`)
                        .then(res => {
                            if (res.data.deletedCount > 0) {
                                navigate("/dashboard/orders")

                            }
                        })
                })
            }
        }
        else {
            console.log("no");
        }

    }

    return (
        // <div>
        //     <div className="flex lg:justify-evenly justify-evenly sm:flex-col">

        //         <h2 className="text-4xl sm:m-4 sm:text-2xl">
        //             Total Item: {addToCart.length} Items
        //         </h2>
        //         <h2 className="text-4xl  sm:m-4 sm:text-2xl">
        //             Total Price:{totalPrice} Tk
        //         </h2>
        //         <button className="btn btn-primary  sm:btn-sm" onClick={handleOrder}>Order</button>
        //     </div>




        //     <div className="overflow-x-auto mb-8">
        //         <table className="table">
        //             {/* head */}
        //             <thead>
        //                 <tr>
        //                     {/* <th>
        //                         <label>
        //                             <input type="checkbox" className="checkbox" />
        //                         </label>
        //                     </th> */}
        //                     <th>#</th>
        //                     <th>Name</th>
        //                     <th className="sm:invisible">price</th>
        //                     <th className="sm:invisible">Quantity</th>
        //                     <th>Total</th>
        //                     <th>delete</th>
        //                     <th></th>
        //                 </tr>
        //             </thead>
        //             <tbody>
        //                 {
        //                     addToCart.map((item, index) =>
        //                         <tr key={item._id}>
        //                             {/* <th>
        //                         <label>
        //                             <input type="checkbox" className="checkbox" />
        //                         </label>
        //                     </th> */}
        //                             <th>{index + 1}</th>
        //                             <th>

        //                                 <div className="flex items-center gap-3">
        //                                     <div className="avatar">
        //                                         <div className="mask mask-squircle w-12 h-12">
        //                                             <img src={item.img} />
        //                                         </div>
        //                                     </div>
        //                                     <div>
        //                                         <div className="font-bold">{item.name}</div>

        //                                     </div>
        //                                 </div>
        //                             </th>


        //                             <td className="sm:invisible">{item.price} Tk</td>
        //                             <td className="sm:invisible">{item?.quantity} Pcs</td>
        //                             <td >
        //                                 {item.price} * {item?.quantity}={item.price * item?.quantity} Tk
        //                             </td>



        //                             <th>
        //                                 <button
        //                                     onClick={() => handleDelete(item._id)}
        //                                     className="btn btn-ghost btn-lg text-red-600"><FaTrashAlt /></button>
        //                             </th>
        //                         </tr>
        //                     )
        //                 }

        //             </tbody>


        //         </table>
        //     </div>

        // </div>
        <div>
            <h2 className="font-manrope font-bold text-4xl leading-10 text-black text-center py-10">
                <step className="text-green-500">Magnetic </step>
                <step className="text-red-500">plus </step>
                Cart Page
            </h2>

            {
                addToCart.length > 0 ?
                    <section className="py-24 relative">
                        <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">


                            <div className="flex items-start flex-col gap-6 xl:flex-row ">
                                <div className="w-full max-w-sm md:max-w-3xl xl:max-w-sm flex items-start flex-col gap-8 max-xl:mx-auto">
                                    <div className="p-6 border border-gray-200 rounded-3xl w-full group transition-all duration-500 hover:border-gray-400 ">
                                        <h2
                                            className="font-manrope font-bold text-3xl leading-10 text-black pb-6 border-b border-gray-200 ">
                                            Cart Summary
                                        </h2>
                                        <div className="data py-6 border-b border-gray-200">
                                            <div className="flex items-center justify-between gap-4 mb-5">
                                                <p className="font-normal text-lg leading-8 text-gray-400 transition-all duration-500 group-hover:text-gray-700">Product Cost</p>
                                                <p className="font-medium text-lg leading-8 text-gray-900">{totalPrice} Tk</p>
                                            </div>
                                            {/* <div className="flex items-center justify-between gap-4 mb-5">
                                    <p className="font-normal text-lg leading-8 text-gray-400 transition-all duration-500 group-hover:text-gray-700">Shipping</p>
                                    <p className="font-medium text-lg leading-8 text-gray-600">$40.00</p>
                                </div> */}
                                            {/* <div className="flex items-center justify-between gap-4 ">
                                    <p className="font-normal text-lg leading-8 text-gray-400 transition-all duration-500 group-hover:text-gray-700 ">Coupon Code</p>
                                    <p className="font-medium text-lg leading-8 text-emerald-500">#APPLIED</p>
                                </div> */}
                                        </div>
                                        {/* <div className="total flex items-center justify-between pt-6">
                                <p className="font-normal text-xl leading-8 text-black ">Subtotal</p>
                                <h5 className="font-manrope font-bold text-2xl leading-9 text-indigo-600">$400.00</h5>
                            </div> */}
                                        <div className="flex justify-end">
                                            <button className="text-xl btn btn-primary flex justify-center" onClick={handleOrder}>Order Now</button>
                                        </div>

                                    </div>
                                </div>


                                <div className="w-full max-w-sm md:max-w-3xl max-xl:mx-auto">
                                    <div className="grid grid-cols-1 gap-6">

                                        {
                                            addToCart.map((item) => <div key={item._id} className="rounded-3xl p-6 bg-gray-100 border border-gray-100 flex flex-col md:flex-row md:items-center gap-5 transition-all duration-500 hover:border-gray-400">
                                                <div className="img-box ">
                                                    <img src={item?.img} alt="Denim Jacket image" className="w-full md:max-w-[122px]" />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3 md:gap-8">
                                                    <div className="">
                                                        <h2 className="font-medium text-xl leading-8 text-black mb-3">{item?.Name}</h2>
                                                        <p className="font-normal text-lg leading-8 text-gray-500 ">By: Magnetic Plus</p>

                                                    </div>
                                                    <div className="flex items-center justify-between gap-8">

                                                        <h6 className="font-medium text-xl leading-8 text-indigo-600">{item?.quantity} pcs  {item?.price * item?.quantity} TK</h6>
                                                        <button
                                                            onClick={() => handleDelete(item._id)}
                                                            className="btn btn-ghost btn-lg text-red-600"><FaTrashAlt /></button>
                                                    </div>
                                                </div>
                                            </div>
                                            )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    :
                    <section className="py-16">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div
                                className="lg:py-14 lg:px-20 p-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-between flex-col lg:flex-row"
                            >
                                <div className="block text-center mb-5 lg:text-left lg:mb-0">
                                    <h2
                                        className="font-manrope text-4xl text-white font-semibold mb-5 lg:mb-2"
                                    >
                                        You don`t Add any Product
                                    </h2>
                                    <p className="text-xl text-indigo-100">
                                        Continue to shopping with Magnetic Plus
                                    </p>
                                </div>
                                <Link
                                    to="/shop"
                                    className="flex items-center gap-2 bg-white rounded-full shadow-sm text-lg text-indigo-600 font-semibold py-4 px-8 transition-all duration-500"
                                >Shop
                                    <svg
                                        width="19"
                                        height="14"
                                        viewBox="0 0 19 14"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M1.75 7L16.4167 7M11.8333 12.5L16.6852 7.64818C16.9907 7.34263 17.1435 7.18985 17.1435 7C17.1435 6.81015 16.9907 6.65737 16.6852 6.35182L11.8333 1.5"
                                            stroke="#4F46E5"
                                            strokeWidth="2.4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </section>
            }





        </div>






    );






};

export default cart;