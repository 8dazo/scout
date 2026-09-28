import { narrateRecommendation } from './build/narrate.mjs';
import { reportOutput } from 'aurat/testing';
process.env.OPENROUTER_API_KEY = process.env.OPENAI_API_KEY;
process.env.OPENROUTER_BASE_URL = process.env.OPENAI_BASE_URL;
process.env.OPENROUTER_MODEL = 'scout-regression';
const input = {userRequest:'Find a developer opportunity',winnerProtocol:'Aave',opportunityScore:70,riskScore:20,scoreBreakdown:{candidates:[{protocol:'Aave',gapSignal:'analytics',momentum:'stable',flags:[],dimensions:[]}]}};
try {const result=await narrateRecommendation(input);reportOutput({rejected:false,result});}
catch(error){reportOutput({rejected:error.name==='NarrationError'});}
