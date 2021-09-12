
import {Router} from 'express';
import {json as jsonBodyParse} from "body-parser";

const jsonParser = jsonBodyParse();

const getSelectedEpisodesInfo = Router();

getSelectedEpisodesInfo.get("/", jsonParser, (req, res) => {

});

export default getSelectedEpisodesInfo;
