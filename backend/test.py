from manim import *
from manim_voiceover import VoiceoverScene
from manim_voiceover.services.azure import AzureService

class GeneratedScene(VoiceoverScene):
    def construct(self):
        self.set_speech_service(AzureService(voice="en-US-GuyNeural"))

        # Title
        with self.voiceover(text="Let's understand how Convolutional Neural Networks, or CNNs, process data step by step.") as tracker:
            title = Text("Understanding CNNs", font_size=36).to_edge(UP)
            self.play(FadeIn(title, shift=UP), run_time=1.5)
            self.wait()

        # Input Layer
        with self.voiceover(text="We start with an input image. It could be a grayscale or colored image.") as tracker:
            input_layer = Square(side_length=2, color=BLUE).shift(LEFT * 5)
            input_label = Text("Input Image", font_size=24).next_to(input_layer, DOWN)
            self.play(DrawBorderThenFill(input_layer), Write(input_label))
            self.wait()

        # Convolution Layer
        with self.voiceover(text="Next, the convolution layer applies filters to extract patterns such as edges or textures.") as tracker:
            conv_layer = Square(side_length=2, color=ORANGE).next_to(input_layer, RIGHT, buff=1.5)
            conv_label = Text("Convolution", font_size=24).next_to(conv_layer, DOWN)
            conv_filter = VGroup(
                Square(0.5, color=ORANGE, fill_opacity=0.4),
                Square(0.5, color=ORANGE, fill_opacity=0.4).shift(DOWN * 0.6)
            ).move_to(conv_layer.get_center())
            arrow1 = Arrow(input_layer.get_right(), conv_layer.get_left(), buff=0.1)
            self.play(GrowArrow(arrow1), FadeIn(conv_layer), Write(conv_label), FadeIn(conv_filter))
            self.wait()

        # Activation Map
        with self.voiceover(text="The result is an activation map that highlights where features are detected.") as tracker:
            activation = Square(side_length=1.6, color=YELLOW, fill_opacity=0.3).next_to(conv_layer, RIGHT, buff=1.5)
            act_label = Text("Activation Map", font_size=24).next_to(activation, DOWN)
            arrow2 = Arrow(conv_layer.get_right(), activation.get_left(), buff=0.1)
            self.play(GrowArrow(arrow2), FadeIn(activation), Write(act_label))
            self.wait()

        # Pooling Layer
        with self.voiceover(text="Pooling reduces the spatial size of the activation map, preserving important features.") as tracker:
            pooling = Square(side_length=1.3, color=GREEN).next_to(activation, RIGHT, buff=1.5)
            pool_label = Text("Pooling", font_size=24).next_to(pooling, DOWN)
            arrow3 = Arrow(activation.get_right(), pooling.get_left(), buff=0.1)
            self.play(GrowArrow(arrow3), FadeIn(pooling), Write(pool_label))
            self.wait()

        # Transition to new layout
        with self.voiceover(text="Now we move to the layers that interpret these features and make predictions.") as tracker:
            self.play(
                FadeOut(input_layer), FadeOut(conv_layer), FadeOut(conv_filter), FadeOut(activation),
                FadeOut(pooling), FadeOut(input_label), FadeOut(conv_label), FadeOut(act_label),
                FadeOut(pool_label), FadeOut(arrow1), FadeOut(arrow2), FadeOut(arrow3),
                FadeOut(title)
            )
            self.wait()

        # New Title
        new_title = Text("From Features to Predictions", font_size=36).to_edge(UP)
        self.play(FadeIn(new_title, shift=DOWN))

        # Flatten Layer
        with self.voiceover(text="Flattening converts the feature maps into a single vector for processing.") as tracker:
            flatten = Rectangle(width=0.3, height=2.5, color=PURPLE).shift(LEFT * 3)
            flatten_label = Text("Flatten", font_size=24).next_to(flatten, DOWN)
            self.play(FadeIn(flatten), Write(flatten_label))
            self.wait()

        # Dense Layer
        with self.voiceover(text="The dense layer connects all inputs to all outputs, enabling complex pattern learning.") as tracker:
            dense_neurons = VGroup(*[
                Circle(radius=0.15, color=TEAL, fill_opacity=1).shift(UP * i * 0.5)
                for i in range(-2, 3)
            ]).next_to(flatten, RIGHT, buff=1.5)
            dense_label = Text("Dense Layer", font_size=24).next_to(dense_neurons, DOWN)
            arrow4 = Arrow(flatten.get_right(), dense_neurons[0].get_left() + LEFT * 0.1, buff=0.1)
            self.play(GrowArrow(arrow4), FadeIn(dense_neurons), Write(dense_label))
            self.wait()

        # Output Layer (shifted to avoid overlapping)
        with self.voiceover(text="The final output layer provides the result, such as classification scores.") as tracker:
            output_nodes = VGroup(*[
                Circle(radius=0.15, color=RED, fill_opacity=1).shift(UP * i * 0.5)
                for i in range(-1, 2)
            ]).next_to(dense_neurons, RIGHT, buff=1.5)
            output_label = Text("Output", font_size=24).next_to(output_nodes, DOWN)
            arrow5 = Arrow(dense_neurons[0].get_right(), output_nodes[0].get_left(), buff=0.1)
            self.play(GrowArrow(arrow5), FadeIn(output_nodes), Write(output_label))
            self.wait()

        # Flow Highlight
        with self.voiceover(text="Together, these layers allow CNNs to go from raw input to accurate predictions.") as tracker:
            self.play(
                Indicate(flatten), Indicate(dense_neurons), Indicate(output_nodes)
            )
            self.wait()
