import Layout from "../components/layout/page";
import ExpenseForm from './form';

export default function ExpenseAdd({children}) {

  return (
          <Layout>
            <ExpenseForm />
          </Layout>
  )
}