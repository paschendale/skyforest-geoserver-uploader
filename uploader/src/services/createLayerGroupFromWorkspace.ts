import geoserver from "../repositories/geoserver";
import { createLayerGroup } from "./createLayerGroup";
import { getLayersFromWorkspace } from "./getLayersFromWorkspace";

export async function createLayerGroupFromWorkspace(
  workspaceName: string,
  layerGroupName: string
) {
  const layers = await getLayersFromWorkspace(workspaceName);

  if (!layers || layers.length === 0) {
    console.log(
      `[dir-removed-controller] no layers found in workspace ${workspaceName}, no layer group was created`
    );
    return;
  }

  let pointLayers = layers.filter((layer) => layer.name.includes("_points"));
  let analysisLayers = layers.filter((layer) =>
    layer.name.includes("_analysis")
  );
  let rasterLayers = layers.filter(
    (layer) =>
      !layer.name.includes("_points") && !layer.name.includes("_analysis")
  );

  await createLayerGroup(
    workspaceName,
    layerGroupName,
    [...rasterLayers, ...analysisLayers, ...pointLayers],
    [
      ...rasterLayers.map((e) => ({
        name: `raster`,
      })),
      ...analysisLayers.map((e) => ({
        name: `raster`,
      })),
      ...pointLayers.map((e) => ({
        name: `${workspaceName}:${e.name}`,
      })),
    ]
  );
}
