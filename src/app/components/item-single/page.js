import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ItemSingle({item, addToExpense}) {
  return (
    <div onClick={() => addToExpense(item) } className="my-2 shadow-sm rounded-md cursor-pointer">
        <h3 className='border ml-1 px-3 py-2 mb-1 rounded-md bg-blue-100'> <FontAwesomeIcon icon={faArrowLeft} /> {item.item} </h3>
  </div>  
  )
}