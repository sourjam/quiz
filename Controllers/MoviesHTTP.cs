using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json.Linq;


namespace quiz.Controllers
{
    public class MoviesHTTP
    {
        public static string searchURL = "https://api.themoviedb.org/3/search/person";
        public static string searchParams = "?api_key=a3d6b934afe418919919cddeaef3d401&query=";
        public static string moviesURL = "https://api.themoviedb.org/3/person/";
        public static string urlParams = "?api_key=a3d6b934afe418919919cddeaef3d401";

        // API call to retrieve list of movie credits using actor ID
        public static JObject getMovies(JValue personID)
        {
            HttpClient client = new HttpClient();
            string URL = moviesURL + personID + "/movie_credits";
            client.BaseAddress = new Uri(URL);

            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));

            var response = client.GetAsync(urlParams).Result;
            if (response.IsSuccessStatusCode)
            {
                var json = response.Content.ReadAsStringAsync().Result;
                JObject joResponse = JObject.Parse(json);
                return joResponse;
            }
            else
            {
                System.Diagnostics.Debug.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
                return null;
            }
        }

        // API call to retrieve actor ID using actor name
        // If actor name is invalid pass Angelina Jolie's actor id to getMovies
        public static JObject Main(string[] args)
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(searchURL);

            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));

            var name = args[0];
            var response = client.GetAsync(searchParams + name).Result;
            if (response.IsSuccessStatusCode)
            {
                var json = response.Content.ReadAsStringAsync().Result;
                JObject joResponse = JObject.Parse(json);

                if (object.Equals(joResponse["total_results"], new JValue(0)))
                {
                    JValue unknown = new JValue("11701");
                    return getMovies(unknown);
                }
                else
                {
                    var personID = joResponse["results"][0]["id"];
                    return getMovies((JValue)personID);
                }
            }
            else
            {
                System.Diagnostics.Debug.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
                return null;
            }
        }
    }
}
