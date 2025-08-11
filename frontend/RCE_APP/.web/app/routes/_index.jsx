

import { Fragment, useCallback, useContext, useEffect } from "react"
import { Badge as RadixThemesBadge, Box as RadixThemesBox, Button as RadixThemesButton, Card as RadixThemesCard, Container as RadixThemesContainer, Flex as RadixThemesFlex, Heading as RadixThemesHeading, Progress as RadixThemesProgress, Separator as RadixThemesSeparator, Spinner as RadixThemesSpinner, Text as RadixThemesText, TextField as RadixThemesTextField, Theme as RadixThemesTheme } from "@radix-ui/themes"
import { Drawer as VaulDrawer } from "vaul"
import { ColorModeContext, EventLoopContext, StateContexts } from "$/utils/context"
import theme from "$/utils/theme"
import { Event, isNotNullOrUndefined, isTrue } from "$/utils/state"
import { Moon as LucideMoon, Sun as LucideSun } from "lucide-react"
import DebounceInput from "react-debounce-input"
import { jsx } from "@emotion/react"



function Fragment_113981255424325296397405511859890890027 () {
  
  const reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state = useContext(StateContexts.reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state)





  
  return (
    jsx(
Fragment,
{},
(isTrue(reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.optimization_logs_rx_state_) ? (jsx(
Fragment,
{},
jsx(
RadixThemesCard,
{className:"card-hover",css:({ ["padding"] : "6" })},
jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",direction:"column",gap:"4"},
jsx(
RadixThemesHeading,
{size:"4"},
"\ud83d\udcdd Logs da Otimiza\u00e7\u00e3o"
,),jsx(Flex_260026382586109821227213132410811638921,{},)
,),),)) : (jsx(
Fragment,
{},
jsx(RadixThemesBox,{},)
,))),)
  )
}

function Fragment_340127774162032043961985691420953306866 () {
  
  const reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state = useContext(StateContexts.reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state)





  
  return (
    jsx(
Fragment,
{},
(reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.is_running_rx_state_ ? (jsx(
Fragment,
{},
jsx(Progress_107699148031562262324246569799398785977,{},)
,)) : (jsx(
Fragment,
{},
jsx(RadixThemesBox,{},)
,))),)
  )
}

function Button_34696280270825497945926428666801604622 () {
  
  const [addEvents, connectErrors] = useContext(EventLoopContext);


  const on_click_a0b592a30e6a3537bdb9ed31f6bd22a2 = useCallback(((_e) => (addEvents([(Event("reflex___state____state.rce_app___backend___app_state____drawer_state.toggle_drawer", ({  }), ({  })))], [_e], ({  })))), [addEvents, Event])



  
  return (
    jsx(
RadixThemesButton,
{css:({ ["@media screen and (min-width: 0)"] : ({ ["display"] : "block" }), ["@media screen and (min-width: 30em)"] : ({ ["display"] : "block" }), ["@media screen and (min-width: 48em)"] : ({ ["display"] : "none" }), ["marginRight"] : "4" }),onClick:on_click_a0b592a30e6a3537bdb9ed31f6bd22a2,size:"4",variant:"ghost"},
"\u2630"
,)
  )
}

function Button_325033248454765305309108746253798502623 () {
  
  const reflex___state____state__rce_app___backend___app_state____app_state = useContext(StateContexts.reflex___state____state__rce_app___backend___app_state____app_state)
  const reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state = useContext(StateContexts.reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state)
  const [addEvents, connectErrors] = useContext(EventLoopContext);


  const on_click_bb391bc93ce791085d20f6e206269e3d = useCallback(((_e) => (addEvents([(Event("reflex___state____state.rce_app___core___ui___pages___framework_rce____framework_rce_state.run_optimization", ({  }), ({  })))], [_e], ({  })))), [addEvents, Event])



  
  return (
    jsx(
RadixThemesButton,
{className:"btn-animate",color:reflex___state____state__rce_app___backend___app_state____app_state.color_scheme_rx_state_,css:({ ["isDisabled"] : reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.is_running_rx_state_, ["width"] : "100%" }),onClick:on_click_bb391bc93ce791085d20f6e206269e3d,size:"4"},
jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",direction:"row",gap:"3"},
jsx(Fragment_244178705994497193685601944940996253382,{},)
,jsx(Text_25324561090358840329477075675906680314,{},)
,),)
  )
}

function Fragment_142763681980494155768234728105902837845 () {
  
  const reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state = useContext(StateContexts.reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state)





  
  return (
    jsx(
Fragment,
{},
(!((reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.best_result_rx_state_ === "")) ? (jsx(
Fragment,
{},
jsx(
RadixThemesCard,
{className:"card-hover",css:({ ["padding"] : "6" })},
jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",direction:"column",gap:"4"},
jsx(
RadixThemesHeading,
{size:"4"},
"\ud83d\udcca Resultados"
,),jsx(Text_194322456082340334474360338747661354759,{},)
,),),)) : (jsx(
Fragment,
{},
jsx(RadixThemesBox,{},)
,))),)
  )
}

function Flex_190033733944771251804095839246536141239 () {
  
  const [addEvents, connectErrors] = useContext(EventLoopContext);





  
  return (
    jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",css:({ ["width"] : "100%" }),direction:"column",gap:"1"},
[["blue", "\ud83d\udd35 Azul"], ["green", "\ud83d\udfe2 Verde"], ["purple", "\ud83d\udfe3 Roxo"], ["orange", "\ud83d\udfe0 Laranja"], ["red", "\ud83d\udd34 Vermelho"]].map((scheme_rx_state_,index_5b78c63a2739ed93)=>(jsx(
RadixThemesButton,
{className:"btn-animate",color:scheme_rx_state_.at(0),css:({ ["width"] : "100%", ["justifyContent"] : "start", ["&:hover"] : ({ ["backgroundColor"] : "rgba(0, 0, 0, 0.1)" }), ["marginBottom"] : "0.5em" }),key:index_5b78c63a2739ed93,onClick:((_e) => (addEvents([(Event("reflex___state____state.rce_app___backend___app_state____app_state.set_color_scheme", ({ ["scheme"] : scheme_rx_state_.at(0) }), ({  })))], [_e], ({  })))),variant:"ghost"},
jsx(
RadixThemesFlex,
{align:"center",className:"rx-Stack",direction:"row",gap:"3"},
jsx(
RadixThemesText,
{as:"p"},
scheme_rx_state_.at(1).split("").at(0)
,),jsx(
RadixThemesText,
{as:"p"},
scheme_rx_state_.at(1).split("").at(1)
,),),))),)
  )
}

function Badge_315996274771294670430331659504454443811 () {
  
  const reflex___state____state__rce_app___backend___app_state____app_state = useContext(StateContexts.reflex___state____state__rce_app___backend___app_state____app_state)





  
  return (
    jsx(
RadixThemesBadge,
{color:reflex___state____state__rce_app___backend___app_state____app_state.color_scheme_rx_state_,variant:"soft"},
"Beta"
,)
  )
}

function Fragment_112897141579454981750442172658474871226 () {
  
  const reflex___state____state__rce_app___backend___app_state____app_state = useContext(StateContexts.reflex___state____state__rce_app___backend___app_state____app_state)





  
  return (
    jsx(
Fragment,
{},
((reflex___state____state__rce_app___backend___app_state____app_state.page_rx_state_ === "framework_rce") ? (jsx(
Fragment,
{},
jsx(
RadixThemesContainer,
{css:({ ["padding"] : "8", ["width"] : "100%", ["maxWidth"] : "1200px" }),size:"3"},
jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",css:({ ["width"] : "100%" }),direction:"column",gap:"4"},
jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",css:({ ["width"] : "100%", ["marginBottom"] : "8" }),direction:"row",gap:"3"},
jsx(
RadixThemesHeading,
{size:"5"},
"Framework RCE \u26a1"
,),jsx(RadixThemesFlex,{css:({ ["flex"] : 1, ["justifySelf"] : "stretch", ["alignSelf"] : "stretch" })},)
,jsx(Badge_315996274771294670430331659504454443811,{},)
,),jsx(
RadixThemesCard,
{className:"card-hover",css:({ ["padding"] : "6", ["marginBottom"] : "8" })},
jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",direction:"column",gap:"4"},
jsx(
RadixThemesHeading,
{css:({ ["marginBottom"] : "4" }),size:"4"},
"\ud83d\udccb Caso de Teste"
,),jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",css:({ ["width"] : "100%" }),direction:"row",gap:"4"},
jsx(Button_217644598192863678798829714982418676541,{},)
,jsx(Button_103120405287423453197295950698792750630,{},)
,jsx(Button_273899390213981578180354028136147396376,{},)
,),),),jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",css:({ ["width"] : "100%", ["marginBottom"] : "8" }),direction:"row",gap:"8"},
jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",css:({ ["width"] : "50%" }),direction:"column",gap:"3"},
jsx(
RadixThemesHeading,
{css:({ ["marginBottom"] : "4" }),size:"4"},
"\ud83d\udd27 Configura\u00e7\u00f5es"
,),jsx(
RadixThemesCard,
{className:"card-hover",css:({ ["padding"] : "6" })},
jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",direction:"column",gap:"4"},
jsx(
RadixThemesText,
{as:"p",css:({ ["fontWeight"] : "bold" })},
"Gera\u00e7\u00f5es:"
,),jsx(Debounceinput_65286218769881942755074937526650620886,{},)
,jsx(
RadixThemesText,
{as:"p",css:({ ["fontWeight"] : "bold" })},
"Tamanho da popula\u00e7\u00e3o:"
,),jsx(Debounceinput_125678245062981076382518853728083509060,{},)
,),),),jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",css:({ ["width"] : "50%" }),direction:"column",gap:"3"},
jsx(
RadixThemesHeading,
{css:({ ["marginBottom"] : "4" }),size:"4"},
"\ud83c\udfaf Probabilidades"
,),jsx(
RadixThemesCard,
{className:"card-hover",css:({ ["padding"] : "6" })},
jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",direction:"column",gap:"4"},
jsx(
RadixThemesText,
{as:"p",css:({ ["fontWeight"] : "bold" })},
"Probabilidade de muta\u00e7\u00e3o:"
,),jsx(Debounceinput_327914257090614166694137757334804436967,{},)
,jsx(
RadixThemesText,
{as:"p",css:({ ["fontWeight"] : "bold" })},
"Probabilidade de crossover:"
,),jsx(Debounceinput_192315350194367104447974424127390790361,{},)
,),),),),jsx(
RadixThemesCard,
{className:"card-hover",css:({ ["padding"] : "6", ["marginBottom"] : "8" })},
jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",direction:"column",gap:"4"},
jsx(Button_325033248454765305309108746253798502623,{},)
,jsx(Fragment_340127774162032043961985691420953306866,{},)
,),),jsx(Fragment_113981255424325296397405511859890890027,{},)
,jsx(Fragment_142763681980494155768234728105902837845,{},)
,),),)) : (jsx(
Fragment,
{},
jsx(
RadixThemesContainer,
{css:({ ["padding"] : "8" }),size:"3"},
jsx(
RadixThemesFlex,
{align:"center",className:"rx-Stack",direction:"column",gap:"8"},
jsx(
RadixThemesHeading,
{size:"5"},
"404 - P\u00e1gina n\u00e3o encontrada"
,),jsx(
RadixThemesText,
{as:"p"},
"A p\u00e1gina solicitada n\u00e3o existe."
,),jsx(Button_140193036177118077054730968426956094131,{},)
,),),))),)
  )
}

function Flex_201860098051602575047801406202799932165 () {
  
  const [addEvents, connectErrors] = useContext(EventLoopContext);





  
  return (
    jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",css:({ ["width"] : "100%", ["marginBottom"] : "4" }),direction:"column",gap:"2"},
jsx(
RadixThemesText,
{as:"p",css:({ ["fontSize"] : "3", ["fontWeight"] : "bold", ["marginBottom"] : "2" })},
"\ud83d\udcc4 P\u00e1ginas"
,),[["\u26a1", "Framework RCE", "framework_rce"], ["\ud83d\udcca", "Simula\u00e7\u00e3o IEEE", "simulacao_ieee"], ["\ud83d\uddd3\ufe0f", "Agendamento", "agendamento"]].map((page_rx_state_,index_54f401f9b5097c91)=>(jsx(
RadixThemesButton,
{className:"btn-animate",css:({ ["width"] : "100%", ["justifyContent"] : "start", ["&:hover"] : ({ ["backgroundColor"] : "rgba(0, 0, 0, 0.1)" }), ["marginBottom"] : "0.5em" }),key:index_54f401f9b5097c91,onClick:((_e) => (addEvents([(Event("reflex___state____state.rce_app___backend___app_state____app_state.set_page", ({ ["page_name"] : page_rx_state_.at(2) }), ({  })))], [_e], ({  })))),variant:"ghost"},
jsx(
RadixThemesFlex,
{align:"center",className:"rx-Stack",direction:"row",gap:"3"},
jsx(
RadixThemesText,
{as:"p",css:({ ["marginRight"] : "0.5em" })},
page_rx_state_.at(0)
,),jsx(
RadixThemesText,
{as:"p"},
page_rx_state_.at(1)
,),),))),)
  )
}

function Text_194322456082340334474360338747661354759 () {
  
  const reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state = useContext(StateContexts.reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state)





  
  return (
    jsx(
RadixThemesText,
{as:"p",css:({ ["whiteSpace"] : "pre-line", ["fontFamily"] : "monospace", ["--default-font-family"] : "monospace" })},
reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.best_result_rx_state_
,)
  )
}

function Debounceinput_125678245062981076382518853728083509060 () {
  
  const reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state = useContext(StateContexts.reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state)
  const [addEvents, connectErrors] = useContext(EventLoopContext);


  const on_change_db96aea9af449678adfb3805e70ec929 = useCallback(((_e) => (addEvents([(Event("reflex___state____state.rce_app___core___ui___pages___framework_rce____framework_rce_state.set_population_size", ({ ["value"] : _e["target"]["value"] }), ({  })))], [_e], ({  })))), [addEvents, Event])



  
  return (
    jsx(DebounceInput,{css:({ ["type"] : "number" }),debounceTimeout:300,element:RadixThemesTextField.Root,onChange:on_change_db96aea9af449678adfb3805e70ec929,placeholder:"20",value:(isNotNullOrUndefined(reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.population_size_rx_state_) ? reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.population_size_rx_state_ : "")},)

  )
}

function Button_140193036177118077054730968426956094131 () {
  
  const reflex___state____state__rce_app___backend___app_state____app_state = useContext(StateContexts.reflex___state____state__rce_app___backend___app_state____app_state)
  const [addEvents, connectErrors] = useContext(EventLoopContext);


  const on_click_00d68b827bec07ed81e92b288f43af11 = useCallback(((_e) => (addEvents([(Event("reflex___state____state.rce_app___backend___app_state____app_state.set_page", ({ ["page_name"] : "framework_rce" }), ({  })))], [_e], ({  })))), [addEvents, Event])



  
  return (
    jsx(
RadixThemesButton,
{color:reflex___state____state__rce_app___backend___app_state____app_state.color_scheme_rx_state_,onClick:on_click_00d68b827bec07ed81e92b288f43af11},
"Voltar ao in\u00edcio"
,)
  )
}

function Debounceinput_65286218769881942755074937526650620886 () {
  
  const reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state = useContext(StateContexts.reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state)
  const [addEvents, connectErrors] = useContext(EventLoopContext);


  const on_change_19b171a98e6738107a93e43e0bf08345 = useCallback(((_e) => (addEvents([(Event("reflex___state____state.rce_app___core___ui___pages___framework_rce____framework_rce_state.set_generations", ({ ["value"] : _e["target"]["value"] }), ({  })))], [_e], ({  })))), [addEvents, Event])



  
  return (
    jsx(DebounceInput,{css:({ ["type"] : "number" }),debounceTimeout:300,element:RadixThemesTextField.Root,onChange:on_change_19b171a98e6738107a93e43e0bf08345,placeholder:"10",value:(isNotNullOrUndefined(reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.generations_rx_state_) ? reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.generations_rx_state_ : "")},)

  )
}

function Debounceinput_192315350194367104447974424127390790361 () {
  
  const reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state = useContext(StateContexts.reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state)
  const [addEvents, connectErrors] = useContext(EventLoopContext);


  const on_change_9855b170940b3867be85b944cc6deab1 = useCallback(((_e) => (addEvents([(Event("reflex___state____state.rce_app___core___ui___pages___framework_rce____framework_rce_state.set_crossover_prob", ({ ["value"] : _e["target"]["value"] }), ({  })))], [_e], ({  })))), [addEvents, Event])



  
  return (
    jsx(DebounceInput,{css:({ ["type"] : "number" }),debounceTimeout:300,element:RadixThemesTextField.Root,onChange:on_change_9855b170940b3867be85b944cc6deab1,placeholder:"0.5",step:"0.1",value:(isNotNullOrUndefined(reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.crossover_prob_rx_state_) ? reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.crossover_prob_rx_state_ : "")},)

  )
}

function Debounceinput_327914257090614166694137757334804436967 () {
  
  const reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state = useContext(StateContexts.reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state)
  const [addEvents, connectErrors] = useContext(EventLoopContext);


  const on_change_8f5112fd9f85d6c15282cbbd6d7a353e = useCallback(((_e) => (addEvents([(Event("reflex___state____state.rce_app___core___ui___pages___framework_rce____framework_rce_state.set_mutation_prob", ({ ["value"] : _e["target"]["value"] }), ({  })))], [_e], ({  })))), [addEvents, Event])



  
  return (
    jsx(DebounceInput,{css:({ ["type"] : "number" }),debounceTimeout:300,element:RadixThemesTextField.Root,onChange:on_change_8f5112fd9f85d6c15282cbbd6d7a353e,placeholder:"0.2",step:"0.1",value:(isNotNullOrUndefined(reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.mutation_prob_rx_state_) ? reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.mutation_prob_rx_state_ : "")},)

  )
}

function Fragment_107907729617918941205932457976215192308 () {
  
  const { rawColorMode } = useContext(ColorModeContext)





  
  return (
    jsx(
Fragment,
{},
((rawColorMode === "dark") ? (jsx(
Fragment,
{},
jsx(LucideSun,{size:20},)
,)) : (jsx(
Fragment,
{},
jsx(LucideMoon,{size:20},)
,))),)
  )
}

function Flex_260026382586109821227213132410811638921 () {
  
  const reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state = useContext(StateContexts.reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state)





  
  return (
    jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",css:({ ["maxHeight"] : "200px", ["overflow"] : "auto" }),direction:"column",gap:"2"},
reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.optimization_logs_rx_state_.map((log_rx_state_,index_4328c39f6f8e09ea)=>(jsx(
RadixThemesText,
{as:"p",css:({ ["fontFamily"] : "monospace", ["--default-font-family"] : "monospace", ["fontSize"] : "2" }),key:index_4328c39f6f8e09ea},
log_rx_state_
,))),)
  )
}

function Text_25324561090358840329477075675906680314 () {
  
  const reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state = useContext(StateContexts.reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state)





  
  return (
    jsx(
RadixThemesText,
{as:"p"},
(reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.is_running_rx_state_ ? "Executando..." : "Rodar Otimiza\u00e7\u00e3o")
,)
  )
}

function Button_217644598192863678798829714982418676541 () {
  
  const reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state = useContext(StateContexts.reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state)
  const reflex___state____state__rce_app___backend___app_state____app_state = useContext(StateContexts.reflex___state____state__rce_app___backend___app_state____app_state)
  const [addEvents, connectErrors] = useContext(EventLoopContext);


  const on_click_9a60f239530faeafda0a221985231bfb = useCallback(((_e) => (addEvents([(Event("reflex___state____state.rce_app___core___ui___pages___framework_rce____framework_rce_state.set_selected_case", ({ ["case"] : "ieee_14" }), ({  })))], [_e], ({  })))), [addEvents, Event])



  
  return (
    jsx(
RadixThemesButton,
{color:((reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.selected_case_rx_state_ === "ieee_14") ? reflex___state____state__rce_app___backend___app_state____app_state.color_scheme_rx_state_ : "gray"),onClick:on_click_9a60f239530faeafda0a221985231bfb,variant:((reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.selected_case_rx_state_ === "ieee_14") ? "solid" : "outline")},
"IEEE 14-Bus"
,)
  )
}

function Progress_107699148031562262324246569799398785977 () {
  
  const reflex___state____state__rce_app___backend___app_state____app_state = useContext(StateContexts.reflex___state____state__rce_app___backend___app_state____app_state)
  const reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state = useContext(StateContexts.reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state)





  
  return (
    jsx(RadixThemesProgress,{className:"progress-animate",color:reflex___state____state__rce_app___backend___app_state____app_state.color_scheme_rx_state_,css:({ ["width"] : "100%" }),value:reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.progress_rx_state_},)

  )
}

function Drawer__root_155999790499561945279984382657410861392 () {
  
  const reflex___state____state__rce_app___backend___app_state____drawer_state = useContext(StateContexts.reflex___state____state__rce_app___backend___app_state____drawer_state)





  
  return (
    jsx(
VaulDrawer.Root,
{direction:"left",modal:true,open:reflex___state____state__rce_app___backend___app_state____drawer_state.is_open_rx_state_},
jsx(
VaulDrawer.Trigger,
{asChild:true},
jsx(
RadixThemesButton,
{className:"btn-animate",css:({ ["@media screen and (min-width: 0)"] : ({ ["display"] : "block" }), ["@media screen and (min-width: 30em)"] : ({ ["display"] : "block" }), ["@media screen and (min-width: 48em)"] : ({ ["display"] : "none" }), ["marginRight"] : "4" }),size:"4",variant:"ghost"},
"\u2630"
,),),jsx(VaulDrawer.Overlay,{css:({ ["position"] : "fixed", ["left"] : "0", ["right"] : "0", ["bottom"] : "0", ["top"] : "0", ["z_index"] : 50, ["background"] : "rgba(0, 0, 0, 0.5)" })},)
,jsx(
VaulDrawer.Portal,
{},
jsx(
RadixThemesTheme,
{css:{...theme.styles.global[':root'], ...theme.styles.global.body}},
jsx(
VaulDrawer.Content,
{css:({ ["left"] : "0", ["right"] : "0", ["bottom"] : "0", ["top"] : "0", ["position"] : "fixed", ["z_index"] : 50, ["display"] : "flex", ["height"] : "100%", ["width"] : "280px", ["padding"] : "0" })},
jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",css:({ ["padding"] : "6", ["width"] : "100%", ["height"] : "100%" }),direction:"column",gap:"4"},
jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",css:({ ["width"] : "100%", ["marginBottom"] : "4" }),direction:"row",gap:"3"},
jsx(
RadixThemesText,
{as:"p",css:({ ["fontSize"] : "5", ["fontWeight"] : "bold" })},
"\ud83e\udded Menu Dashboard"
,),jsx(RadixThemesFlex,{css:({ ["flex"] : 1, ["justifySelf"] : "stretch", ["alignSelf"] : "stretch" })},)
,jsx(
VaulDrawer.Close,
{asChild:true},
jsx(
RadixThemesButton,
{className:"btn-animate",css:({ ["&:hover"] : ({ ["backgroundColor"] : "rgba(255, 0, 0, 0.1)" }) }),size:"2",variant:"ghost"},
"\u2715"
,),),),jsx(RadixThemesSeparator,{size:"4"},)
,jsx(Flex_201860098051602575047801406202799932165,{},)
,jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",css:({ ["width"] : "100%", ["marginBottom"] : "4" }),direction:"column",gap:"2"},
jsx(
RadixThemesText,
{as:"p",css:({ ["fontSize"] : "3", ["fontWeight"] : "bold", ["marginBottom"] : "2" })},
"\ud83c\udfa8 Personaliza\u00e7\u00e3o"
,),jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",css:({ ["width"] : "100%", ["justifyContent"] : "space-between", ["marginBottom"] : "2" }),direction:"row",gap:"3"},
jsx(
RadixThemesText,
{as:"p",css:({ ["fontSize"] : "3" })},
"\ud83c\udf19"
,),jsx(Button_48484500544526860738419905772504774835,{},)
,jsx(
RadixThemesText,
{as:"p",css:({ ["fontSize"] : "3" })},
"\u2600\ufe0f"
,),),jsx(
RadixThemesText,
{as:"p",css:({ ["fontSize"] : "2", ["marginBottom"] : "1" })},
"Paleta de Cores:"
,),jsx(Flex_190033733944771251804095839246536141239,{},)
,),jsx(RadixThemesFlex,{css:({ ["flex"] : 1, ["justifySelf"] : "stretch", ["alignSelf"] : "stretch" })},)
,jsx(
RadixThemesFlex,
{align:"center",className:"rx-Stack",direction:"column",gap:"1"},
jsx(
RadixThemesText,
{as:"p",css:({ ["fontSize"] : "2", ["color"] : "gray.500" })},
"UFF RCE"
,),jsx(
RadixThemesText,
{as:"p",css:({ ["fontSize"] : "1", ["color"] : "gray.400" })},
"v1.0.0"
,),),),),),),)
  )
}

function Fragment_244178705994497193685601944940996253382 () {
  
  const reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state = useContext(StateContexts.reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state)





  
  return (
    jsx(
Fragment,
{},
(reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.is_running_rx_state_ ? (jsx(
Fragment,
{},
jsx(RadixThemesSpinner,{size:"2"},)
,)) : (jsx(
Fragment,
{},
jsx(
RadixThemesText,
{as:"p"},
"\u25b6\ufe0f"
,),))),)
  )
}

function Badge_177299004286344604370062308147871518141 () {
  
  const reflex___state____state__rce_app___backend___app_state____app_state = useContext(StateContexts.reflex___state____state__rce_app___backend___app_state____app_state)





  
  return (
    jsx(
RadixThemesBadge,
{color:reflex___state____state__rce_app___backend___app_state____app_state.color_scheme_rx_state_,variant:"soft"},
"Online"
,)
  )
}

function Button_103120405287423453197295950698792750630 () {
  
  const reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state = useContext(StateContexts.reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state)
  const reflex___state____state__rce_app___backend___app_state____app_state = useContext(StateContexts.reflex___state____state__rce_app___backend___app_state____app_state)
  const [addEvents, connectErrors] = useContext(EventLoopContext);


  const on_click_3521e41204f90f8566e07424f8fd6bc3 = useCallback(((_e) => (addEvents([(Event("reflex___state____state.rce_app___core___ui___pages___framework_rce____framework_rce_state.set_selected_case", ({ ["case"] : "ieee_30" }), ({  })))], [_e], ({  })))), [addEvents, Event])



  
  return (
    jsx(
RadixThemesButton,
{color:((reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.selected_case_rx_state_ === "ieee_30") ? reflex___state____state__rce_app___backend___app_state____app_state.color_scheme_rx_state_ : "gray"),onClick:on_click_3521e41204f90f8566e07424f8fd6bc3,variant:((reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.selected_case_rx_state_ === "ieee_30") ? "solid" : "outline")},
"IEEE 30-Bus"
,)
  )
}

function Button_48484500544526860738419905772504774835 () {
  
  const { setColorMode } = useContext(ColorModeContext)
  const [addEvents, connectErrors] = useContext(EventLoopContext);


  const on_click_5af0904cb090e26f77d4b7f82a03bf68 = useCallback(((_e) => (addEvents([(Event("_call_function", ({ ["function"] : (() => (setColorMode(({ ["button"] : _e["button"], ["buttons"] : _e["buttons"], ["client_x"] : _e["clientX"], ["client_y"] : _e["clientY"], ["alt_key"] : _e["altKey"], ["ctrl_key"] : _e["ctrlKey"], ["meta_key"] : _e["metaKey"], ["shift_key"] : _e["shiftKey"] })))), ["callback"] : null }), ({  })))], [_e], ({  })))), [addEvents, Event, setColorMode])



  
  return (
    jsx(
RadixThemesButton,
{className:"btn-animate",css:({ ["marginRight"] : "2" }),onClick:on_click_5af0904cb090e26f77d4b7f82a03bf68,size:"3",variant:"ghost"},
jsx(Fragment_107907729617918941205932457976215192308,{},)
,)
  )
}

function Button_273899390213981578180354028136147396376 () {
  
  const reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state = useContext(StateContexts.reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state)
  const reflex___state____state__rce_app___backend___app_state____app_state = useContext(StateContexts.reflex___state____state__rce_app___backend___app_state____app_state)
  const [addEvents, connectErrors] = useContext(EventLoopContext);


  const on_click_6be69efff92fc2d63aeacf2ca0d0912c = useCallback(((_e) => (addEvents([(Event("reflex___state____state.rce_app___core___ui___pages___framework_rce____framework_rce_state.set_selected_case", ({ ["case"] : "custom" }), ({  })))], [_e], ({  })))), [addEvents, Event])



  
  return (
    jsx(
RadixThemesButton,
{color:((reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.selected_case_rx_state_ === "custom") ? reflex___state____state__rce_app___backend___app_state____app_state.color_scheme_rx_state_ : "gray"),onClick:on_click_6be69efff92fc2d63aeacf2ca0d0912c,variant:((reflex___state____state__rce_app___core___ui___pages___framework_rce____framework_rce_state.selected_case_rx_state_ === "custom") ? "solid" : "outline")},
"Rede Simples"
,)
  )
}

export default function Component() {
    




  return (
    jsx(
Fragment,
{},
jsx(
RadixThemesBox,
{css:({ ["width"] : "100%", ["minHeight"] : "100vh", ["backgroundColor"] : "gray.50" })},
jsx(Drawer__root_155999790499561945279984382657410861392,{},)
,jsx(
RadixThemesBox,
{css:({ ["width"] : "100%" })},
jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",css:({ ["width"] : "100%", ["padding"] : "4 8", ["borderBottom"] : "1px solid", ["borderColor"] : "gray.200", ["backgroundColor"] : "white", ["position"] : "sticky", ["top"] : "0", ["zIndex"] : "100" }),direction:"row",gap:"3"},
jsx(Button_34696280270825497945926428666801604622,{},)
,jsx(
RadixThemesHeading,
{size:"5"},
"UFF RCE WebApp"
,),jsx(RadixThemesFlex,{css:({ ["flex"] : 1, ["justifySelf"] : "stretch", ["alignSelf"] : "stretch" })},)
,jsx(
RadixThemesFlex,
{align:"start",className:"rx-Stack",direction:"row",gap:"2"},
jsx(Button_48484500544526860738419905772504774835,{},)
,jsx(Badge_177299004286344604370062308147871518141,{},)
,),),jsx(
RadixThemesBox,
{css:({ ["padding"] : "8", ["minHeight"] : "calc(100vh - 80px)", ["backgroundColor"] : "gray.50" })},
jsx(Fragment_112897141579454981750442172658474871226,{},)
,),),),jsx(
"title",
{},
"UFF RCE WebApp"
,),jsx("meta",{content:"favicon.ico",property:"og:image"},)
,)
  )
}
