using Bogus;
using MusicStoreApp.Models;

namespace MusicStoreApp.Services
{
    public class DataGenerator
    {
        public List<Song> GenerateSongs(string locale, long userSeed, int pageIndex, double avgLikes)
        {
            // Fix: Convert 'en-US' or 'uk-UA' to just 'en' or 'uk'
    string cleanedLocale = locale.Split('-')[0]; 

    // Now use cleanedLocale instead of locale
    var faker = new Faker<Song>(cleanedLocale);
            long pageSeed = (userSeed * 6364136223846793005L) + pageIndex;
            faker.UseSeed((int)(pageSeed % int.MaxValue));

            faker.RuleFor(s => s.Index, f => (pageIndex * 10) + f.IndexFaker + 1)
                 .RuleFor(s => s.Title, f => f.Commerce.ProductName())
                 .RuleFor(s => s.Artist, f => f.Name.FullName())
                 .RuleFor(s => s.Album, f => f.Commerce.Color() + " Album")
                 .RuleFor(s => s.Genre, f => f.Music.Genre())
                 // Generates fake lyrics like the image
                 .RuleFor(s => s.Lyrics, f => $"{f.Hacker.Phrase()}\n{f.Company.CatchPhrase()}\n{f.Hacker.Phrase()}");

            var songs = faker.Generate(10).ToList();
            var likeRandom = new Random((int)((userSeed + pageIndex) % int.MaxValue));

            foreach (var song in songs)
            {
                int floorLikes = (int)Math.Floor(avgLikes);
                song.Likes = floorLikes + (likeRandom.NextDouble() < (avgLikes - floorLikes) ? 1 : 0);
            }
            return songs;
        }
    }
}