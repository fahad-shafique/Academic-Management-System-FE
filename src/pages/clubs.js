import React from "react";
import SearchBar from "../components/search-bar";
import ClubsGrid from "../components/clubs/clubs-grid";
import Layout from "../layouts/Layout";

const Clubs = () => {

  return (
      <div
          className={
              "text-primary bg-primary relative mx-auto flex w-full flex-col px-[10vw] md:px-[5vw] pb-20"
          }
      >
          <Layout>
            <React.Fragment>
                <section className="mb-16 mt-0 space-y-8 md:mt-20">
                    <SearchBar/>
                </section>

                <ClubsGrid/>

            </React.Fragment>
          </Layout>
      </div>
)
    ;
};

export default Clubs;
