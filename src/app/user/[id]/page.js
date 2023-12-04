import { getServerSession } from "next-auth";
import { Backend_URL } from "../../../lib/Constants";
import Layout from "../../components/layout/page";
import { authOptions } from "../../api/auth/[...nextauth]/route";

const Profile = async (props) => {
    const session = await getServerSession(authOptions);
    const response = await fetch(Backend_URL + `/user/${props.params.id}`, {
        method: "GET",
        headers: { 
            authorization: `Bearer ${session ? session.backendTokens.accessToken : ''}`,
            "Content-Type": "application/json" 
        },
    });

    const user = await response.json();

    return (
        <Layout>
            <div className="m-2 border rounded shadow overflow-hidden">
                <div className="p-2 bg-gradient-to-b from-gray-500 to-gray-700 text-white">
                    User Profile
                </div>
                <div className="p-2">
                    <div className="flex ">
                        <p className="w-1/6 p-2 text-gray-900">Name</p>
                        <p className="w-5/6 p-2 text-slate-950">: {user.name}</p>
                    </div>
                    <div className="flex ">
                        <p className="w-1/6 p-2 text-gray-900">Email</p>
                        <p className="w-5/6 p-2 text-slate-950">: {user.email}</p>
                    </div>
                    <div className="flex ">
                        <p className="w-1/6 p-2 text-gray-900">Stock Balance</p>
                        <p className="w-5/6 p-2 text-slate-950">: {user.InStock}</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
};

export default Profile;