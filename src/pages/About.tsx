import React from 'react';
import { Users, Award, Heart, Target, Music, BookOpen, Star, Clock } from 'lucide-react';

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Founder & Lead Piano Instructor",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "With over 15 years of teaching experience and a Master's in Music Education, Sarah founded PianoLearn to make quality piano education accessible to everyone.",
    specialties: ["Classical Piano", "Music Theory", "Beginner Education"]
  },
  {
    name: "Marcus Williams",
    role: "Jazz Piano Specialist",
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "A professional jazz pianist who has performed with renowned artists worldwide. Marcus brings real-world performance experience to our jazz curriculum.",
    specialties: ["Jazz Improvisation", "Blues Piano", "Contemporary Styles"]
  },
  {
    name: "Elena Rodriguez",
    role: "Classical Piano Master",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "Trained at prestigious conservatories in Europe, Elena specializes in classical repertoire and advanced technique development.",
    specialties: ["Classical Repertoire", "Advanced Technique", "Performance Preparation"]
  },
  {
    name: "David Chen",
    role: "Technology & Innovation Director",
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "A software engineer and pianist who develops our innovative learning tools and interactive features to enhance the online learning experience.",
    specialties: ["Educational Technology", "Pop Piano", "Digital Innovation"]
  }
];

const milestones = [
  {
    year: "2018",
    title: "PianoLearn Founded",
    description: "Started with a simple mission: make piano learning accessible to everyone"
  },
  {
    year: "2019",
    title: "First 1,000 Students",
    description: "Reached our first milestone of 1,000 active students worldwide"
  },
  {
    year: "2020",
    title: "Mobile App Launch",
    description: "Launched our mobile app to enable learning anywhere, anytime"
  },
  {
    year: "2021",
    title: "50,000 Students",
    description: "Grew to serve over 50,000 piano students across 80+ countries"
  },
  {
    year: "2022",
    title: "Award Recognition",
    description: "Won 'Best Online Music Education Platform' award"
  },
  {
    year: "2023",
    title: "100,000+ Students",
    description: "Celebrated reaching over 100,000 students and 1 million lesson completions"
  }
];

const values = [
  {
    icon: Heart,
    title: "Passion for Music",
    description: "We believe music enriches lives and brings joy to people of all ages"
  },
  {
    icon: Users,
    title: "Inclusive Learning",
    description: "Piano education should be accessible regardless of age, background, or experience"
  },
  {
    icon: Target,
    title: "Excellence",
    description: "We maintain the highest standards in our teaching methods and content quality"
  },
  {
    icon: BookOpen,
    title: "Continuous Innovation",
    description: "We constantly evolve our platform to provide the best learning experience"
  }
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            About PianoLearn
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            Empowering piano students worldwide with innovative teaching methods and passionate instruction
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At PianoLearn, we believe that everyone deserves access to quality piano education. 
                Our mission is to break down the barriers that prevent people from learning piano - 
                whether it's cost, location, time constraints, or intimidation.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We've developed innovative teaching methods, including our revolutionary A-B-C letter 
                system, that make piano learning intuitive and enjoyable for students of all ages and backgrounds.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">100,000+</div>
                  <div className="text-gray-600">Students Taught</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">80+</div>
                  <div className="text-gray-600">Countries Reached</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Piano learning"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">98% Success Rate</div>
                    <div className="text-sm text-gray-600">Student Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at PianoLearn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="group text-center p-8 bg-gray-50 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              World-class musicians and educators dedicated to your piano journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-purple-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm">Specialties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Key milestones in our mission to revolutionize piano education
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-600 to-blue-600 rounded-full"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="text-2xl font-bold text-purple-600 mb-2">{milestone.year}</div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="relative z-10 w-4 h-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Awards & Recognition
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Recognition from industry leaders and educational institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Best Online Music Education Platform",
                year: "2023",
                organization: "EdTech Awards"
              },
              {
                icon: Star,
                title: "Excellence in Music Education",
                year: "2022",
                organization: "Music Teachers Association"
              },
              {
                icon: Users,
                title: "Most Innovative Learning Platform",
                year: "2021",
                organization: "Online Learning Consortium"
              }
            ].map((award, index) => {
              const IconComponent = award.icon;
              return (
                <div
                  key={index}
                  className="text-center p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{award.title}</h3>
                  <p className="text-purple-600 font-semibold mb-1">{award.year}</p>
                  <p className="text-gray-600 text-sm">{award.organization}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Piano Journey?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of students who have discovered the joy of playing piano with PianoLearn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 font-bold px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-purple-600 transition-all duration-300">
              View Courses
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;