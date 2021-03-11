//interface for working with the data from the get() request
export interface RepoCommits {
    sha: string,
    node_id: string,
    commit: {
      author: {
          name: string, //"Spencer"
          email: string,
          date: string
      }
      //commiter:{}
      message: string,
      //tree: {},
      url: string,
      comment_count: number,
      //verification: {},
    }
    url: string,
    html_url: string,
    comments_url: string,
    author: {
        login: string, //"spencer012"
        id: number,
        node_id: string,
        avatar_url: string,
        gravatar_id: string,
        url: string,
        html_url: string,
        followers_url: string,
        following_url: string,
        gists_url: string,
        starred_url: string,
        subscriptions_url: string,
        organizations_url: string,
        repos_url: string,
        events_url: string,
        received_events_url: string,
        type: string,
        site_admin: boolean
    },
    //commiter: {},
    //parents: {}
  }
  
  