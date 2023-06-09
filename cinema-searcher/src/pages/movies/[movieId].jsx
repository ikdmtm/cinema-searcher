import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "src/components/Main/Main.module.css";
import { Header } from "src/components/Header/Header";
import { NavMenu } from "src/components/NavMenu/NavMenu";
import { Footer } from "src/components/Footer/Footer";
import { Items } from "src/components/Items/Items";

const Show = (props) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>映画検索</title>
        <meta charset="utf-8" />
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          type="text/css"
          href="http://mplus-fonts.sourceforge.jp/webfonts/general-j/mplus_webfonts.css"
        ></link>
      </Head>

      <div className={styles.container}>
        <Header handleMenu={props.handleMenu} open={props.open} />
        {props.open ? (
          <NavMenu handleMenu={props.handleMenu} categories={props.categories} />
        ) : null}
        <div>
          <ul className={styles.pcNavMenu}>
            <Link href={"/popular"}>
              <li className={router.route == "/popular" ? styles.pageTitle : null}>最近の人気</li>
            </Link>
            <Link href={"/"}>
              <li className={router.route == "/" ? styles.pageTitle : null}>評価が高い映画</li>
            </Link>
            <Link href={"/now_playing"}>
              <li className={router.route == "/now_playing" ? styles.pageTitle : null}>上映中</li>
            </Link>
            <Link href={"/upcoming"}>
              <li className={router.route == "/upcoming" ? styles.pageTitle : null}>近日公開</li>
            </Link>
          </ul>
        </div>
        <main className={styles.main}>
          <p className={styles.title}>- 映画詳細 -</p>

          {props.movie ? (
            <div className={styles.box}>
              <div className={styles.left}>
                <div className={styles.image}>
                  <Image
                    src={"http://image.tmdb.org/t/p/w342" + `${props.movie.poster_path}`}
                    alt={`${props.movie.title}` + "のポスター"}
                    layout="fill"
                  />
                </div>
              </div>
              <div className={styles.right}>
                <p className={styles.movieTitle}>{props.movie.title}</p>
                <p className={styles.year}>{props.movie.release_date}</p>
                <p className={styles.movieDiscription}>{props.movie.overview}</p>
                <div className={styles.categories}>
                  {props.movie.genres.map((genre) => {
                    return (
                      <p className={styles.category} key={genre.id}>
                        {genre.name}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <p>データがありません</p>
          )}
          <p className={styles.title}>- 似ている映画 -</p>
          {props.similar.length ? (
            <Items moviesData={props.similar} categories={props.categories} />
          ) : (
            <p>データがありません</p>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { movieId } = context.query;
  const src1 = `https://api.themoviedb.org/3/movie/${movieId}?api_key=54206ad48e363ded4ba03637e6c92d43&language=ja-JP`;
  const src2 = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=54206ad48e363ded4ba03637e6c92d43&language=ja-JP&page=1`;
  try {
    const [movieRes, similarRes] = await Promise.all([fetch(src1), fetch(src2)]);

    if (!movieRes.ok || !similarRes.ok) {
      throw new Error("Failed to fetch movie data from API");
    }

    const movieData = await movieRes.json();
    const similarData = await similarRes.json();

    const movie = movieData || null;
    const similar = similarData.results || null;
    return {
      props: {
        movie,
        similar,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        movie: null,
        similar: null,
      },
    };
  }
};

export default Show;
