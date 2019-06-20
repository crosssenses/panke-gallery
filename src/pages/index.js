import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import Moment from 'moment'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import ExhibitionPreview from '../components/exhibition-preview'


class PankeIndex extends React.Component {
  render() {

    // Get array of exhibitions
    const posts = get(this, 'props.data.allContentfulExhibition.edges')
    
    // Get array of news
    const newsItems = get(this, 'props.data.allContentfulContentBlock.edges')

    // Log array of all exhibitions
//    console.log("Posts:");
//    console.log(posts);
    
    // Log array of news
//    console.log("news:");
//    console.log(newsItems);
    
    // Filter array of exhibitions
    function filterCurrent(_ex) {
      var currentDate = new Date();
      var exhibtionStartDate = new Date(_ex.node.startDate);
      var exhibtionEndDate = new Date(_ex.node.endDate);
      return Moment(exhibtionStartDate, 'day').utcOffset(120).isSameOrBefore(currentDate, 'day') && Moment(exhibtionEndDate, 'day').utcOffset(120).isSameOrAfter(currentDate, 'day');
    }
    const currentExhibitions = posts.filter(filterCurrent);

    function filterUpcoming(_ex) {
      var currentDate = new Date();
      var exhibtionStartDate = new Date(_ex.node.startDate);
      return Moment(exhibtionStartDate, 'day').utcOffset(120).isAfter(currentDate, 'day');
    }
    const upcomingExhibitions = posts.filter(filterUpcoming);

    // Log array of current exhibitions
//    console.log("Current Exhibitions:");
//    console.log(currentExhibitions);

    // Log array of upcoming exhibitions
//    console.log("Upcoming Exhibitions:");
//    console.log(upcomingExhibitions);

    // Create news code
    var news;
    if (newsItems){
      news = (
        <section className="news">
          {newsItems.map(({node}) => {
            return (
              <article key={node.id} className="news-item">
                <div className="row headline">
                  <div className="col-md-12 col-sm-12 col-xs-12">
                    <h2>{node.title}</h2>
                  </div>
                </div>
                <div className="row">
                  {<div className="col-md-12 col-sm-12 col-xs-12" dangerouslySetInnerHTML={{
                      __html: node.blockContent.childMarkdownRemark.html
                    }} />}
                </div>
              </article>
            )
          })}

        </section>
      );
    }

    // Create current exhibitions code if there are
    var current;
    if (currentExhibitions.length > 0){
      current = (
        <section className="currently">

          <div className="row headline">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <h2>Current</h2>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-sm-8 col-xs-12">
              {currentExhibitions.map(({ node }) => {
                return (
                    <ExhibitionPreview key={node.slug} exhibition={node} />
                )
              })}
            </div>
          </div>
        </section>
      );
    }

    // Create upcoming exhibitions code if there are
    var upcoming;
    if (upcomingExhibitions.length > 0){
      upcoming = (
        <section className="upcoming">

          <div className="row headline">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <h2>Upcoming</h2>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-sm-8 col-xs-12">
              {upcomingExhibitions.map(({ node }) => {
                return (
                    <ExhibitionPreview key={node.slug} exhibition={node} />
                )
              })}
            </div>
          </div>
        </section>
      );
    }

    return (
      <Layout>
        <Helmet
          title= '  Home'
          meta={[
            {
              name: 'description',
              content: 'News and upcoming exhibitions of panke.gallery in Berlin-Wedding. The gallery seeks to open up a dialogue between established and emerging artists whose work comes out of the connections between digital or net-based art and club culture.'
            }
          ]}
        />

        {news}

        {current}

        {upcoming}

      </Layout>

    );
  }
}

export default PankeIndex

export const pageQuery = graphql`
  query PankeHomeQuery {
    allContentfulExhibition(
      sort: { fields: [startDate], order: ASC }

    ) {
      edges {
        node {
          title
          slug
          startDate
          endDate
          #startDate(formatString: "DD MMMM YYYY")
          #endDate(formatString: "DD MMMM YYYY")
          featuredImage {
            sizes(maxWidth: 1000) {
             ...GatsbyContentfulSizes
            }
          }
          openingHours
          vernissageInfos
          subtitleShortDescription {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    }
    allContentfulContentBlock (filter: {page: {eq: "News"}}, sort: { fields: [createdAt], order: ASC}){
      edges {
        node {
          id
          title
          page
          slug
          blockContent {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    }
  }
`
