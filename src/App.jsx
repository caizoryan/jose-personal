import { createEffect, createMemo, createSignal, For, Show } from "solid-js"
import { Transition } from "solid-transition-group"

let [data, setData] = createSignal([])

let aliases = {
  "360b": "360 Safety"
}

async function get_channel(slug) { return await fetch("https://api.are.na/v2/channels/" + slug + "?per=50").then(res => res.json()) }

get_channel("3-hummus").then((res) => {
  let names = {}
  res.contents.forEach((block) => {
    if (block.class != "Image") return

    if (!names[block.title]) { names[block.title] = [] }
    names[block.title].push(block.image.display.url)

  })

  let d = Object.entries(names)
    .map(([key, value]) => ({
      title: aliases[key] ? aliases[key] : key,
      images: value
    }))

  setData(d)

})


let about = []

let [selected, setSelected] = createSignal(undefined)
createEffect(() => console.log(selected()))

function Contents() {
  return (
    <div class="content-grid">
      <div class="left">
        <Title></Title>
        <About></About>
      </div>

      <div class="right">
        <Images></Images>
      </div>

    </div>
  )
}

function Title() {
  return (
    <div class="floating">
      <div class="text-head">
        <div class="title-text">Jose Montero</div>
      </div>
    </div>)
}

function Images() {
  return (<div class="images floating">
    <div class="text-head"> <div class="number">2</div>Projects</div>
    <For each={data()}>
      {(e, i) => <Project
        index={i} title={e.title} images={e.images}></Project>}
    </For>
  </div>)
}

function Project(props) {
  // on hover, show image
  const [showing, setShowing] = createSignal(false)
  const mouseover = () => setShowing(true)
  const mouseout = () => setShowing(false)
  const onclick = () => setSelected(props.index())

  return (
    <div>
      <h4 class="project-title"
        onclick={onclick}
        onmouseover={mouseover}
        onmouseout={mouseout}
      > {props.title} </h4>
      <Show when={showing()}>
        <img src={props.images[0]} class="hover-image"></img>
      </Show>
    </div>
  )
}

function ProjectPage() {
  console.log("moutned")
  let selected_project = createMemo(() => data()[selected()])

  return (
    <div class="project-page">
      <div class="title-bar">
        <div class="close"
          onclick={() => setSelected(undefined)}>Back</div>

        <h4 class="project-page-title">{selected_project().title}</h4>
        <div class="project-page-image-container">
          <For each={selected_project().images}>
            {(image) => <img src={image}></img>}
          </For>
        </div>
      </div>
    </div>
  )
}


function About() {
  return (<div class="floating">
    <div class="text-head"> <div class="number">3</div>About</div>
  </div>)
}

// Title bar
// -------------------------
// About | Images
// About |
// About |
// ------
// links |
// links |


function App() {
  return (
    <div class="container">
      <Contents></Contents>
      <Transition name="slide-fade">
        <Show when={selected() != undefined}>
          <ProjectPage></ProjectPage>
        </Show>
      </Transition>
    </div>
  );
}

export default App;
