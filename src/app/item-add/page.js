import Layout from "../components/layout/page";
import Form from './form';

export default async function ItemAdd({children}) {
  return (
    <Layout>
      <div className="p-2 bg-gradient-to-b from-gray-500 to-gray-700 text-white rounded">
          Add Items
      </div>
      <Form />
    </Layout>
  )
}