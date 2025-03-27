import { Button } from "antd";

const Home = ( {onClickPlan})=>{
    return(
        <>
        <h1> Welcome Chandra </h1>
        <h1>Start Planning your day</h1>
        <Button onClick={onClickPlan}> Click here </Button>
        </>
    );
}
export default Home;