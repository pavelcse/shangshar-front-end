import Layout from "../components/layout/page";
import DashboardComponent from './dashboard';

export default function Dashboard({children}) {
  return (
          <Layout>
            <div className="p-2 bg-gradient-to-b from-gray-500 to-gray-700 text-white rounded">
                Dashboard
            </div>
            <div className="grid grid-cols-4 gap-2">
              <DashboardComponent />
            </div>
        </Layout>
  )
}