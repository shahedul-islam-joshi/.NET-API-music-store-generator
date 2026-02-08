using Bogus;
using MusicStoreApp.Models;

namespace MusicStoreApp.Services
{
    public class DataGenerator
    {
        public List<Song> GenerateSongs(string locale, long userSeed, int pageIndex, double avgLikes)
        {
            // FIX: Bogus wants "en", not "en-US". This splits the string at the '-'.
            string cleanedLocale = locale.Contains("-") ? locale.Split('-')[0] : locale;

            var faker = new Faker<Song>(cleanedLocale);

            // Combine seed and page for deterministic results
            long pageSeed = (userSeed * 6364136223846793005L) + pageIndex;
            faker.UseSeed((int)(pageSeed % int.MaxValue));

            faker.RuleFor(s => s.Index, f => (pageIndex * 10) + f.IndexFaker + 1)
                 .RuleFor(s => s.Title, f => f.Music.Genre() + " " + f.Commerce.ProductName())
                 .RuleFor(s => s.Artist, f => f.Name.FullName())
                 .RuleFor(s => s.Album, f => f.Commerce.Color() + " Album")
                 .RuleFor(s => s.Genre, f => f.Music.Genre())
                 .RuleFor(s => s.Lyrics, f => $"{f.Rant.Review()}\n\n{f.Company.CatchPhrase()}");

            var songs = faker.Generate(10).ToList();

            // Probabilistic Likes calculation
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