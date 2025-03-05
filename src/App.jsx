import { createEffect, createMemo, createSignal, For, Show } from "solid-js"
import { Transition } from "solid-transition-group"

let data = [
  {
    title: "Poster #1",
    images: ["./assets/poster_1.jpg"]
  },

  {
    title: "Booklet",
    images: [
      "./assets/booklet_1.png",
      "./assets/booklet_0.png",
      "./assets/booklet_2.png",
      "./assets/booklet_3.png",
      "./assets/booklet_4.png",
      "./assets/booklet_5.png",
      "./assets/booklet_6.png",
      "./assets/booklet_7.png",
      "./assets/booklet_8.png",
      "./assets/booklet_9.png",
      "./assets/booklet_10.png",
      "./assets/booklet_11.png"
    ]
  }
]

let about = [
  `One of the most present short-comings of our modern infrastructure is the compromise in safety that the disconnection between set traffic laws and current safety demands has created in day-to-day life.`,
  `By this, I mean that our current traffic infrastructure can no longer keep up with the safety demands created by the new types of drivers and their respective safety requirements. The road infrastructure established across most of the North-American continent by the 1930s was built for one type of road user: automobiles. This was done, of course, for good reason— at the time, automobiles were the fastest and most efficient way to get around, as cities could not yet be traversed quickly or comfortably otherwise and, as they grew, so did our dependency on vehicles.`,
  `Almost a century later, we've developed alternate forms of transportation alongside the framework for them. The issue is, improper implementation of these alternative forms of transportation has resulted in a inherent friction between the different types of road users (now automobiles, cyclists, and pedestrians). `
]

let [selected, setSelected] = createSignal(undefined)
createEffect(() => console.log(selected()))


function TitleBar() {
  return (
    <div class="title-bar">
      <div class="title-text"> Jose Montero </div>
    </div>
  )
}

function Contents() {
  return (
    <div class="content-grid">

      <div class="left">
        <About></About>
        <Links></Links>
      </div>

      <div class="right">
        <Images></Images>
      </div>

    </div>
  )
}

function About() {
  return (<div class="floating">
    <div class="text-head"> <div class="number">1</div>About</div>
    <div class="text">
      <For each={about}>
        {(e) => <p>{e}</p>}
      </For>
    </div>
  </div>)
}

function Images() {
  return (<div class="images floating">
    <div class="text-head"> <div class="number">2</div>Projects</div>
    <For each={data}>
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
  let selected_project = createMemo(() => data[selected()])

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


function Links() {
  return (<div class="floating">
    <div class="text-head"> <div class="number">3</div>Links</div>
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
      <TitleBar></TitleBar>
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
