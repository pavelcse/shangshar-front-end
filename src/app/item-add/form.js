"use client"

import { Backend_URL } from '../../lib/Constants';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Form({children}) {
    const {data: session} = useSession();

    const [data, setData] = useState({
        id: '',
        item: '',
        cost: '',
    });

    const [items, setItems] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({...data, [name]: value});
    }
    
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const res = await fetch(Backend_URL + "/item/add", {
          method: "POST",
          body: JSON.stringify({
              userId: session?.user.id,
              id: data.id,
              item: data.item,
              cost: data.cost,
          }),
          headers: { 
              "Content-Type": "application/json" ,
              authorization: `Bearer ${ session?.backendTokens.accessToken }`
          }
      });

      const response = await res.json();

      if(!res.ok) {
          toast.error(response.message);
          return;
      }

      if(data.id) {
        const updatedItems = items.map((item) => {
          if(item.id === response.id) {
            return {
              ...item,
              item: response.item,
              cos: response.cost,
            }
          }
          return item;
        });
        setItems(updatedItems);
      } else {
        setItems((items) => [...items, response]);
      }

      setData({id: '', item: '', cost: ''});
        toast.success('Item Added');
      }

      const editItem = (item) => {
        setData({id: item.id, item: item.item, cost: item.cost});
      }

      const deleteItem = async (itemId) => {
        const res = await fetch(Backend_URL + "/item/delete/" + itemId, {
          method: "GET",
          headers: {
              authorization: `Bearer ${ session?.backendTokens.accessToken }`
          }
        });

        const response = await res.json();

        if(!res.ok) {
            toast.error(response.message);
            return;
        } else {
          const updatedItems = items.filter((item) => item.id !== response.id);
          setItems(updatedItems);
          setData({id: '', item: '', cost: ''});
          toast.success("Item deleted successfully");
        }
      }

      useEffect(() => {
        const fetchData = async () => {
          const response = await fetch(Backend_URL + "/item/" + session?.user.id, {
            headers: { 
                "Content-Type": "application/json" ,
                authorization: `Bearer ${ session?.backendTokens.accessToken }`
            }
          });

          if(response.ok) {
            const result = await response.json();
            setItems(result)
          }
        };
    
        if(session) {
          fetchData();
        }
        
      }, [session]);

    return (
        <>
        <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-sm p-5 mb-2 w-full flex">
          <div className="w-4/6">
            <input type="text" name="item" value={data.item} onChange={e => handleChange(e)} className="py-3 px-3 ps-11 rounded-lg w-full border border-gray-300" placeholder="Item Name" />
          </div>
          <div className="w-1/6">
            <input type="number" name="cost" value={data.cost} onChange={e => handleChange(e)} className="py-3 px-3 ps-11 mx-2 rounded-lg w-full border border-gray-300" placeholder="Amount" />
          </div>
          <div className="w-1/6">
            <button type='submit' className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-10 rounded-full float-right">Save Item</button>
          </div>
        </div>
      </form>
      <div className="bg-white shadow-sm p-5 w-full max-h-[700px] overflow-y-scroll">
        <table className="w-full min-w-max table-auto text-left divide-y divide-gray-200">
          <thead className="sticky top-0 bg-gray-900 text-white">
            <tr>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-3 transition-colors hover:bg-blue-gray-50">Item Name</th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-3 transition-colors hover:bg-blue-gray-50">Amount</th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-3 transition-colors hover:bg-blue-gray-50">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
                <tr key={item.id}>
                    <td className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-2 transition-colors hover:bg-blue-gray-50">{item.item}</td>
                    <td className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-2 transition-colors hover:bg-blue-gray-50">{item.cost}/-</td>
                    <td className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-2 transition-colors hover:bg-blue-gray-50">
                        <button onClick={() => editItem(item) } className="rounded-md bg-blue-500 px-3 py-2 mx-1 text-sm text-white">Edit</button>
                        <button onClick={() => deleteItem(item.id)} className="rounded-md bg-red-600 px-3 py-2 mx-1 text-sm text-white">Delete</button>
                    </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
        </>
    )
}