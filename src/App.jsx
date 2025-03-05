import { createEffect, createMemo, createSignal, For, Show } from "solid-js"
import { Transition } from "solid-transition-group"

let [data, setData] = createSignal([])
let [about, setAbout] = createSignal("")

let aliases = {
  "360b": "360 Safety",
  "mock-up": "Hyperbolic Cod3x UI Design",
  "second_wind": "Second Wind Publication",
  "intel": "Intel Graphics"
}

async function get_channel(slug) { return await fetch("https://api.are.na/v2/channels/" + slug + "?per=50").then(res => res.json()) }

get_channel("3-hummus").then((res) => {
  let names = {}
  res.contents.forEach((block) => {
    if (block.class == "Image" || block.class == "Attachment") {
      if (!block.title || block.title == "suh-dude.png") return
      if (!names[block.title]) { names[block.title] = { images: [] } }

      names[block.title].images.push(block.image.display.url)

      if (block.class == "Attachment") {
        console.log("blcok", block)
        names[block.title].video = block.attachment.url
      }
    }

  })

  res.contents.forEach(block => {
    if (block.class == "Text") {
      console.log("text", block.title)
      console.log("name", names[block.title])

      if (block.title.toLowerCase() == "about") {
        setAbout(block.content)
      }

      else if (names[block.title]) {
        names[block.title].desc = block.content
      }
    }

  })

  let d = Object.entries(names)
    .map(([key, value]) => ({
      title: aliases[key] ? aliases[key] : key,
      images: value.images,
      video: value.video,
      desc: value.desc
    }))

  setData(d)

})



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
        <Show when={selected_project().desc}> <p class="description">{selected_project().desc}</p> </Show>
        <div class="project-page-image-container">
          <Show when={selected_project().video}>
            <video src={selected_project().video} controls></video>
          </Show>
          <Show when={!selected_project().video}>
            <For each={selected_project().images}>
              {(image) => <img src={image}></img>}
            </For>
          </Show>
        </div>
      </div>
    </div>
  )
}


function About() {
  return (<div class="floating">
    <div class="text-head">
      <div class="number">3</div>
      About
    </div>
    <div class="about" >
      {about}
    </div>
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
