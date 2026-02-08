using Bogus;
using MusicStoreApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MusicStoreApp.Services
{
    public class DataGenerator
    {
        // This is the method the Controller is looking for!
        public List<Song> GenerateSongs(string locale, long userSeed, int pageIndex, double avgLikes)
        {
            // 1. Set the locale (e.g., "en", "de", "uk")
            var faker = new Faker<Song>(locale);

            // 2. The MAD Operation for reproducibility
            // We combine the seed and page number to get a unique seed for this specific page
            long pageSeed = (userSeed * 6364136223846793005L) + pageIndex;
            faker.UseSeed((int)(pageSeed % int.MaxValue));

            // 3. Define the rules for generating fake song data
            faker.RuleFor(s => s.Index, f => (pageIndex * 10) + f.IndexFaker + 1)
                 .RuleFor(s => s.Title, f => f.Commerce.ProductName())
                 .RuleFor(s => s.Artist, f => f.Name.FullName())
                 .RuleFor(s => s.Album, f => f.Commerce.Color() + " Album")
                 .RuleFor(s => s.Genre, f => f.Music.Genre());

            // 4. Generate 10 songs and convert to a List
            var songs = faker.Generate(10).ToList();

            // 5. Probabilistic Likes Logic
            var likeRandom = new Random((int)((userSeed + pageIndex) % int.MaxValue));
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