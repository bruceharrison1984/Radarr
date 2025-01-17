using NzbDrone.Core.Configuration;
using Radarr.Http.REST;

namespace Radarr.Api.V3.Config
{
    public class ImportListConfigResource : RestResource
    {
        public string ListSyncLevel { get; set; }
        public bool IgnoreRelatedCollectionMoviesDuringListSync { get; set; }
    }

    public static class ImportListConfigResourceMapper
    {
        public static ImportListConfigResource ToResource(IConfigService model)
        {
            return new ImportListConfigResource
            {
                ListSyncLevel = model.ListSyncLevel,
                IgnoreRelatedCollectionMoviesDuringListSync = model.IgnoreRelatedCollectionMoviesDuringListSync
            };
        }
    }
}
