import type { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import { getPluginId } from './.config/webpack/utils';
import grafanaConfig from './.config/webpack/webpack.config';

const config = async (env): Promise<Configuration> => {
  const baseConfig = await grafanaConfig(env);

  return merge(baseConfig, {
    output: {
      asyncChunks: true,
      publicPath: `public/plugins/${getPluginId()}/`
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      }
    }
  });
};

export default config;
