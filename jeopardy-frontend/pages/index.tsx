import type { NextPage } from "next";
import Head from "next/head";
import { GameScreen } from "../components/GameScreen";

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Play Jeopardy!</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="">
                <GameScreen />
            </main>
        </div>
    );
};

export default Home;
