using Bogus;
using MusicStoreApp.Models;

namespace MusicStoreApp.Services
{
    public class DataGenerator
    {
        public List<Song> GenerateSongs(string locale, long userSeed, int pageIndex, double avgLikes)
        {
            // 1. MAD Operation: Combine UserSeed and PageIndex
            long combinedSeed = (userSeed * 6364136223846793005L) + pageIndex;

            // 2. Initialize Faker with the correct locale
            var faker = new Faker<Song>(locale);

            // 3. APPLY THE SEED (Fix for 'UseSeed' error)
            faker.UseSeed((int)(combinedSeed % int.MaxValue));

            // 4. DEFINE RULES (Fix for 'IndexFaker', 'Music', and 'FullName' errors)
            faker.RuleFor(s => s.Index, f => (pageIndex * 10) + f.IndexFaker + 1)
                 .RuleFor(s => s.Title, f => f.Commerce.ProductName())
                 .RuleFor(s => s.Artist, f => f.Person.FullName) // person.FullName is a property now
                 .RuleFor(s => s.Album, f => f.Commerce.Color() + " Album")
                 .RuleFor(s => s.Genre, f => f.Music.Genre()); // music.Genre() is correct

            // 5. GENERATE (Fix for 'IEnumerable to List' error)
            List<Song> songs = faker.Generate(10).ToList();

            // 6. PROBABILISTIC LIKES logic
            var likeRandom = new Random((int)((userSeed + pageIndex + 777) % int.MaxValue));
            foreach (var song in songs)
            {
                int floorLikes = (int)Math.Floor(avgLikes);
                double remainder = avgLikes - floorLikes;
                song.Likes = floorLikes + (likeRandom.NextDouble() < remainder ? 1 : 0);
            }

            return songs;
        }
    }
}